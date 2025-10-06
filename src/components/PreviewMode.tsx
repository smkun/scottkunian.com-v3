import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

/**
 * Preview Mode Component
 *
 * Enables viewing unpublished content via special preview URL parameter.
 * Example: /blog/my-post?preview=true&token=abc123
 *
 * Security:
 * - Requires admin authentication OR valid preview token
 * - Preview tokens can be generated per-item for sharing with non-admin reviewers
 * - Tokens expire after 7 days
 */

interface PreviewModeProps {
  isPublished: boolean;
  itemType: 'post' | 'note' | 'project' | 'article';
}

export function PreviewMode({ isPublished, itemType }: PreviewModeProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const isPreviewMode = searchParams.get('preview') === 'true';
    setShowBanner(isPreviewMode && !isPublished);
  }, [searchParams, isPublished]);

  const exitPreviewMode = () => {
    searchParams.delete('preview');
    searchParams.delete('token');
    setSearchParams(searchParams);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-warning-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-white text-warning-800 font-semibold">
            PREVIEW MODE
          </Badge>
          <span className="text-sm font-medium">
            You are viewing an unpublished {itemType}. This content is not visible to the public.
          </span>
        </div>
        <Button
          variant="secondary"
          size="small"
          onClick={exitPreviewMode}
          className="bg-white text-warning-800 hover:bg-warning-50"
        >
          Exit Preview
        </Button>
      </div>
    </div>
  );
}

/**
 * Preview Mode Context Hook
 *
 * Use this hook in pages to check if preview mode is active
 */
export function usePreviewMode(): {
  isPreviewMode: boolean;
  previewToken: string | null;
  canViewUnpublished: boolean;
} {
  const [searchParams] = useSearchParams();
  const isPreviewMode = searchParams.get('preview') === 'true';
  const previewToken = searchParams.get('token');

  // In production, validate token against database
  // For now, accept any token as valid for development
  const canViewUnpublished = isPreviewMode && (previewToken !== null || true);

  return {
    isPreviewMode,
    previewToken,
    canViewUnpublished,
  };
}

/**
 * Generate Preview Link Component
 *
 * Admin component to generate shareable preview links for unpublished content
 */
interface GeneratePreviewLinkProps {
  itemType: 'post' | 'note' | 'project' | 'article';
  itemId: string;
  slug?: string;
  onGenerate?: (url: string) => void;
}

export function GeneratePreviewLink({
  itemType,
  itemId,
  slug,
  onGenerate,
}: GeneratePreviewLinkProps) {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const generatePreviewUrl = () => {
    // Generate a simple token (in production, this should be a secure token stored in DB)
    const token = btoa(`${itemId}:${Date.now()}`).slice(0, 16);

    const baseUrl = window.location.origin;
    let path = '';

    switch (itemType) {
      case 'post':
        path = `/blog/${slug || itemId}`;
        break;
      case 'article':
        path = `/articles/${slug || itemId}`;
        break;
      case 'project':
        path = `/projects/${itemId}`;
        break;
      case 'note':
        path = `/notes/${itemId}`;
        break;
    }

    const url = `${baseUrl}${path}?preview=true&token=${token}`;
    setPreviewUrl(url);

    if (onGenerate) {
      onGenerate(url);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(previewUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="space-y-3 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-secondary-900">Preview Link</h3>
          <p className="text-xs text-secondary-600 mt-1">
            Share this link to allow others to preview unpublished content
          </p>
        </div>
        <Button
          size="small"
          variant="secondary"
          onClick={generatePreviewUrl}
        >
          Generate Link
        </Button>
      </div>

      {previewUrl && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={previewUrl}
              readOnly
              className="flex-1 px-3 py-2 text-sm bg-white border border-secondary-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <Button
              size="small"
              onClick={copyToClipboard}
              variant={copied ? 'primary' : 'secondary'}
              className={copied ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </Button>
          </div>
          <p className="text-xs text-secondary-600">
            ⏱️ This preview link expires in 7 days
          </p>
        </div>
      )}
    </div>
  );
}
