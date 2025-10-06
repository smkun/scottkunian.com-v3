// GitHub API Integration
// Fetches repository data for automated project synchronization

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  language: string | null;
  pushed_at: string;
  topics: string[];
  private: boolean;
}

export interface GitHubError {
  message: string;
  status?: number;
}

const GITHUB_API_BASE = 'https://api.github.com';

// Rate limiting configuration
interface RateLimitInfo {
  remaining: number;
  reset: number; // Unix timestamp
  limit: number;
}

let cachedRateLimit: RateLimitInfo | null = null;
const requestCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Check GitHub API rate limit status
 */
export const checkRateLimit = async (): Promise<RateLimitInfo> => {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/rate_limit`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`Rate limit check failed: ${response.status}`);
    }

    const data = await response.json();
    cachedRateLimit = {
      remaining: data.resources.core.remaining,
      reset: data.resources.core.reset,
      limit: data.resources.core.limit,
    };

    return cachedRateLimit;
  } catch (error) {
    console.error('Error checking rate limit:', error);
    // Return safe defaults if check fails
    return {
      remaining: 0,
      reset: Date.now() / 1000 + 3600,
      limit: 60,
    };
  }
};

/**
 * Get cached data if available and fresh
 */
const getCachedData = <T>(cacheKey: string): T | null => {
  const cached = requestCache.get(cacheKey);
  if (!cached) return null;

  const age = Date.now() - cached.timestamp;
  if (age > CACHE_TTL) {
    requestCache.delete(cacheKey);
    return null;
  }

  return cached.data as T;
};

/**
 * Cache API response
 */
const setCachedData = (cacheKey: string, data: unknown): void => {
  requestCache.set(cacheKey, {
    data,
    timestamp: Date.now(),
  });
};

/**
 * Wait until rate limit resets
 */
const waitForRateLimit = async (resetTime: number): Promise<void> => {
  const now = Date.now() / 1000;
  const waitSeconds = Math.max(0, resetTime - now);

  if (waitSeconds > 0) {
    console.warn(`Rate limit exceeded. Waiting ${Math.ceil(waitSeconds)} seconds...`);
    await new Promise(resolve => setTimeout(resolve, waitSeconds * 1000));
  }
};

/**
 * Make rate-limited GitHub API request with caching
 */
const rateLimitedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  // Check cache first
  const cacheKey = `${url}:${JSON.stringify(options)}`;
  const cached = getCachedData<Response>(cacheKey);
  if (cached) {
    console.log(`Cache hit for ${url}`);
    return cached;
  }

  // Check rate limit before making request
  if (cachedRateLimit && cachedRateLimit.remaining < 5) {
    await waitForRateLimit(cachedRateLimit.reset);
    cachedRateLimit = null; // Force recheck after waiting
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      ...options.headers,
    },
  });

  // Update rate limit info from response headers
  const remaining = response.headers.get('X-RateLimit-Remaining');
  const reset = response.headers.get('X-RateLimit-Reset');
  const limit = response.headers.get('X-RateLimit-Limit');

  if (remaining && reset && limit) {
    cachedRateLimit = {
      remaining: parseInt(remaining, 10),
      reset: parseInt(reset, 10),
      limit: parseInt(limit, 10),
    };
  }

  // Check if we hit rate limit
  if (response.status === 403 && cachedRateLimit) {
    const resetDate = new Date(cachedRateLimit.reset * 1000);
    throw new Error(
      `GitHub API rate limit exceeded. Resets at ${resetDate.toLocaleTimeString()}. ` +
      `Limit: ${cachedRateLimit.limit} requests/hour.`
    );
  }

  // Cache successful responses
  if (response.ok) {
    setCachedData(cacheKey, response.clone());
  }

  return response;
};

/**
 * Fetch a single repository by owner and name
 */
export const getRepository = async (
  owner: string,
  repo: string
): Promise<GitHubRepo | null> => {
  try {
    const response = await rateLimitedFetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Repository ${owner}/${repo} not found`);
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching repository:', error);
    throw error;
  }
};

/**
 * Fetch all public repositories for a user
 */
export const getUserRepositories = async (
  username: string,
  options: {
    sort?: 'created' | 'updated' | 'pushed' | 'full_name';
    direction?: 'asc' | 'desc';
    per_page?: number;
  } = {}
): Promise<GitHubRepo[]> => {
  const {
    sort = 'updated',
    direction = 'desc',
    per_page = 100,
  } = options;

  try {
    const url = new URL(`${GITHUB_API_BASE}/users/${username}/repos`);
    url.searchParams.set('sort', sort);
    url.searchParams.set('direction', direction);
    url.searchParams.set('per_page', per_page.toString());
    url.searchParams.set('type', 'public');

    const response = await rateLimitedFetch(url.toString());

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`User ${username} not found`);
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user repositories:', error);
    throw error;
  }
};

/**
 * Parse GitHub URL to extract owner and repo name
 */
export const parseGitHubUrl = (url: string): { owner: string; repo: string } | null => {
  try {
    // Handle various GitHub URL formats:
    // - https://github.com/owner/repo
    // - https://github.com/owner/repo.git
    // - git@github.com:owner/repo.git
    const patterns = [
      /github\.com\/([^\/]+)\/([^\/\.]+)/i,
      /github\.com:([^\/]+)\/([^\/\.]+)/i,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return {
          owner: match[1],
          repo: match[2],
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Error parsing GitHub URL:', error);
    return null;
  }
};

/**
 * Sync GitHub repository data with Firestore project
 */
export const syncRepositoryData = async (githubUrl: string) => {
  const parsed = parseGitHubUrl(githubUrl);
  if (!parsed) {
    throw new Error('Invalid GitHub URL');
  }

  const repo = await getRepository(parsed.owner, parsed.repo);
  if (!repo) {
    throw new Error('Repository not found');
  }

  return {
    githubUrl: repo.html_url,
    liveUrl: repo.homepage || undefined,
    description: repo.description || '',
    technologies: repo.topics.length > 0 ? repo.topics : [repo.language].filter(Boolean) as string[],
    githubData: {
      stars: repo.stargazers_count,
      language: repo.language || 'Unknown',
      lastPush: new Date(repo.pushed_at),
      description: repo.description || '',
    },
  };
};

/**
 * Fetch multiple repositories and filter/sort them
 */
export const getFilteredRepositories = async (
  username: string,
  filters: {
    minStars?: number;
    excludeForks?: boolean;
    excludeTopics?: string[];
    includeTopics?: string[];
  } = {}
): Promise<GitHubRepo[]> => {
  const repos = await getUserRepositories(username);

  return repos.filter(repo => {
    // Filter by minimum stars
    if (filters.minStars && repo.stargazers_count < filters.minStars) {
      return false;
    }

    // Filter by topics
    if (filters.excludeTopics && filters.excludeTopics.some(topic => repo.topics.includes(topic))) {
      return false;
    }

    if (filters.includeTopics && !filters.includeTopics.some(topic => repo.topics.includes(topic))) {
      return false;
    }

    return true;
  });
};