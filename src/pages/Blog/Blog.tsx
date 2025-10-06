import { useState, useEffect } from 'react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Image } from '../../components/ui/Image';
import { Post, getPosts } from '../../lib/firestore';
import { highlightCode, getLanguageLabel } from '../../lib/syntaxHighlighter';

export function Blog() {
  return (
    <Routes>
      <Route path="/" element={<BlogListing />} />
      <Route path="/:slug" element={<BlogPost />} />
    </Routes>
  );
}

function BlogListing() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const allPosts = await getPosts(true); // Only published posts
      setPosts(allPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get all unique tags
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags))).sort();

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  // Separate featured and regular posts
  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Blog</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Thoughts on software development, technology, and building great products.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="max-w-md mx-auto">
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant={selectedTag === null ? 'secondary' : 'ghost'}
              size="small"
              onClick={() => setSelectedTag(null)}
            >
              All
            </Button>
            {allTags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? 'secondary' : 'ghost'}
                size="small"
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Featured Posts</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-medium transition-shadow">
                {post.imageUrl && (
                  <div className="w-full overflow-hidden rounded-t-lg">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      aspectRatio="16/9"
                      objectFit="cover"
                      showSkeleton
                      className="w-full h-full"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="primary">Featured</Badge>
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="text-xl">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="hover:text-primary-600 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>{post.summary}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {post.publishedAt?.toDate().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    {post.viewCount && <span>{post.viewCount} views</span>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Regular Posts */}
      {regularPosts.length > 0 ? (
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            {featuredPosts.length > 0 ? 'All Posts' : 'Recent Posts'}
          </h2>
          <div className="grid gap-6">
            {regularPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-medium transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <CardTitle className="text-xl mb-2">
                        <Link
                          to={`/blog/${post.slug}`}
                          className="hover:text-primary-600 transition-colors"
                        >
                          {post.title}
                        </Link>
                      </CardTitle>
                      <CardDescription>{post.summary}</CardDescription>
                    </div>
                    {post.imageUrl && (
                      <div className="w-24 h-24 ml-4 overflow-hidden rounded-lg flex-shrink-0">
                        <Image
                          src={post.imageUrl}
                          alt={post.title}
                          aspectRatio="1"
                          objectFit="cover"
                          showSkeleton
                          className="w-full h-full"
                        />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {post.publishedAt?.toDate().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    {post.viewCount && <span>{post.viewCount} views</span>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchTerm || selectedTag ? 'No posts found' : 'No posts yet'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedTag
                ? 'Try adjusting your search or filter criteria.'
                : 'Check back soon for new content!'}
            </p>
            {(searchTerm || selectedTag) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTag(null);
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      loadPost(slug);
    }
  }, [slug]);

  const loadPost = async (postSlug: string) => {
    try {
      const posts = await getPosts(true); // Only published posts
      const foundPost = posts.find(p => p.slug === postSlug);

      if (foundPost) {
        setPost(foundPost);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Error loading post:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-4xl mb-4">📄</div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">Post Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The post you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/blog')}>← Back to Blog</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <header className="mb-8">
        <div className="mb-4">
          <Button variant="ghost" onClick={() => navigate('/blog')}>
            ← Back to Blog
          </Button>
        </div>

        {/* Featured Image */}
        {post.imageUrl && (
          <div className="w-full overflow-hidden rounded-lg mb-6">
            <Image
              src={post.imageUrl}
              alt={post.title}
              aspectRatio="16/9"
              objectFit="cover"
              showSkeleton
              className="w-full h-full"
            />
          </div>
        )}

        {/* Title and Meta */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {post.featured && <Badge variant="primary">Featured</Badge>}
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl font-bold text-foreground leading-tight">
            {post.title}
          </h1>

          <p className="text-xl text-muted-foreground">
            {post.summary}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              Published {post.publishedAt?.toDate().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            {post.viewCount && <span>{post.viewCount} views</span>}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <MarkdownRenderer content={post.body} />
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-border">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => navigate('/blog')}>
            ← Back to Blog
          </Button>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Share:</span>
            <Button
              variant="ghost"
              size="small"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: post.title,
                    text: post.summary,
                    url: window.location.href
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  // Could show a toast notification here
                }
              }}
            >
              Copy Link
            </Button>
          </div>
        </div>
      </footer>
    </article>
  );
}

// Simple Markdown Renderer (reusing the logic from MarkdownEditor)
function MarkdownRenderer({ content }: { content: string }) {
  const parseMarkdown = (text: string): string => {
    let html = text;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-foreground mb-3 mt-6">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold text-foreground mb-4 mt-8">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-foreground mb-4 mt-8">$1</h1>');

    // Bold and Italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

    // Code
    html = html.replace(/`(.*?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary-600 hover:text-primary-700 underline" target="_blank" rel="noopener noreferrer">$1</a>');

    // Lists
    html = html.replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>');
    html = html.replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>');

    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary-200 pl-4 italic text-muted-foreground my-4">$1</blockquote>');

    // Code blocks with syntax highlighting
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_match, language, code) => {
      const lang = language || 'text';
      const highlightedCode = highlightCode(code.trim(), lang);
      const langLabel = getLanguageLabel(lang);
      return `<div class="relative my-6">
        <div class="flex items-center justify-between bg-muted px-4 py-2 border-b border-border rounded-t-lg">
          <span class="text-xs font-medium text-muted-foreground">${langLabel}</span>
          <button
            class="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded transition-colors"
            onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.querySelector('code').textContent); this.textContent='Copied!'; setTimeout(() => this.textContent='Copy', 2000)"
            title="Copy code"
          >
            Copy
          </button>
        </div>
        <pre class="bg-muted p-4 rounded-b-lg overflow-x-auto"><code class="text-sm font-mono leading-relaxed">${highlightedCode}</code></pre>
      </div>`;
    });

    // Paragraphs (split by double newlines)
    const paragraphs = html.split('\n\n');
    html = paragraphs.map(p => {
      const trimmed = p.trim();
      if (trimmed && !trimmed.startsWith('<')) {
        return `<p class="mb-4 leading-relaxed">${trimmed.replace(/\n/g, '<br>')}</p>`;
      }
      return trimmed.replace(/\n/g, '<br>');
    }).join('\n\n');

    return html;
  };

  return (
    <div
      className="prose prose-lg max-w-none text-foreground"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
}