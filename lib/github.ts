export type RepoSummary = {
  name: string;
  fullName: string;
  url: string;
  stars: number;
  description: string | null;
  language: string | null;
  lastUpdate: string;
  owner: string;
};

export async function searchRepositories(query: string, options: { language?: string, minStars?: number, limit?: number } = {}) {
  const { language, minStars = 0, limit = 10 } = options;
  
  let q = query;
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
    // If token is invalid, retry without it
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
