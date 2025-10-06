import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Note, getNotes } from '../../lib/firestore';

export function Nybles() {
  const [nybles, setNybles] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNybles();
  }, []);

  const loadNybles = async () => {
    try {
      const allNybles = await getNotes(true); // Only public nybles
      // Sort by createdAt descending (newest first)
      const sortedNybles = allNybles.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      setNybles(sortedNybles);
    } catch (error) {
      console.error('Error loading nybles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg text-muted-foreground">Loading nybles...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 backdrop-blur-md rounded-3xl shadow-2xl p-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Nybles</h1>
          <p className="text-xl text-muted-foreground">
            Exploring ideas, lessons, and stories from my adventures in tech, gaming, and life
          </p>
        </div>

        {/* Nybles List */}
        {nybles.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground text-lg">
                No nybles published yet. Check back soon!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {nybles.map((nyble) => (
              <NybleCard key={nyble.id} nyble={nyble} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface NybleCardProps {
  nyble: Note;
}

function NybleCard({ nyble }: NybleCardProps) {
  // Remove emojis from text
  const removeEmojis = (text: string) => {
    return text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim();
  };

  // Parse content: extract title (between **) and body
  const parseContent = (content: string) => {
    const titleMatch = content.match(/\*\*(.*?)\*\*/);
    if (titleMatch) {
      const title = removeEmojis(titleMatch[1]);
      const body = removeEmojis(content.replace(/\*\*.*?\*\*\n\n/, '').trim());
      return { title, body };
    }
    return { title: null, body: removeEmojis(content) };
  };

  const { title, body } = parseContent(nyble.content);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 bg-white/10 backdrop-blur-sm border-border/50">
      <CardContent className="py-6">
        {title && (
          <h3 className="text-lg font-semibold mb-3 text-primary">
            {title}
          </h3>
        )}
        <div className="text-foreground/90 leading-relaxed">
          {body}
        </div>
      </CardContent>
    </Card>
  );
}
