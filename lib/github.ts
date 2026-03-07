export type RepoSummary = {
  name: string;
  fullName: string;
  url: string;
  stars: number;
  description: string | null;
  language: string | null;
  lastUpdate: string;
  owner: string;
  matchDetails?: { detail: string; found: boolean }[];
};

export async function searchRepositories(query: string, options: { user?: string, language?: string, minStars?: number, limit?: number } = {}) {
  const { user, language, minStars = 0, limit = 10 } = options;
  
  let q = query;
  if (user) q += ` user:${user}`;
  if (language) q += ` language:${language}`;
  if (minStars > 0) q += ` stars:>=${minStars}`;

  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=${limit}`;
  
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'GitSearch-RefactCode'
  };

  if (process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN !== 'your_github_pat_here') {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  let response = await fetch(url, { headers });
  if (response.status === 401) {
    delete headers['Authorization'];
    response = await fetch(url, { headers });
  }

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`GitHub API error: ${response.status} - ${errorBody}`);
  }

  const data = await response.json();
  
  return data.items.map((item: any) => ({
    name: item.name,
    fullName: item.full_name,
    url: item.html_url,
    stars: item.stargazers_count,
    description: item.description,
    language: item.language,
    lastUpdate: item.updated_at,
    owner: item.owner.login
  })) as RepoSummary[];
}

export async function getReadmeContent(owner: string, repo: string): Promise<string> {
  const url = `https://api.github.com/repos/${owner}/${repo}/readme`;
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'GitSearch-RefactCode'
  };

  if (process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN !== 'your_github_pat_here') {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) return "";
    const data = await response.json();
    if (data.content) {
      // GitHub returns base64 encoded content
      return Buffer.from(data.content, 'base64').toString('utf-8');
    }
    return "";
  } catch {
    return "";
  }
}
