import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Image } from '../../components/ui/Image';
import { Article, getArticles } from '../../lib/firestore';

export function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const allArticles = await getArticles(true); // Only visible articles
      setArticles(allArticles);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return '';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg text-muted-foreground">Loading articles...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-7xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 backdrop-blur-md rounded-3xl shadow-2xl p-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Field Notes</h1>
          <p className="text-xl text-muted-foreground">
            Long-form thoughts and insights from LinkedIn and beyond
          </p>
        </div>

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground text-lg">
                No articles published yet. Check back soon!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} formatDate={formatDate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ArticleCardProps {
  article: Article;
  formatDate: (timestamp: any) => string;
}

function ArticleCard({ article, formatDate }: ArticleCardProps) {
  return (
    <div className="group bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-primary/30 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:scale-105 h-full flex flex-col">
      {/* Article Image */}
      {article.imageUrl && (
        <div className="w-full h-48 overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.title}
            aspectRatio="16/9"
            objectFit="cover"
            showSkeleton
            className="w-full h-full group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      )}

      {/* Article Content */}
      <div className="flex-1 p-6 flex flex-col">
        {/* Meta Info */}
        <div className="flex items-center gap-3 mb-3">
          <Badge variant={article.source === 'linkedin' ? 'primary' : 'secondary'}>
            {article.source === 'linkedin' ? '🔗 LinkedIn' : '✏️ Manual'}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatDate(article.publishedAt)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-3 leading-tight">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            {article.title}
          </a>
        </h3>

        {/* Description */}
        {article.description && (
          <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed text-sm flex-1">
            {article.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end pt-4 border-t border-border/30 mt-auto">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="primary" size="small">
              Read →
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
