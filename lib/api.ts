// News API
export const newsAPI = {
  async getAll(): Promise<any[]> {
    const res = await fetch('/api/news', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch news');
    return res.json();
  },
  async create(data: any): Promise<any> {
    const res = await fetch('/api/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create news');
    return res.json();
  },
};

// Users API
export const usersAPI = {
  async getAll(): Promise<any[]> {
    const res = await fetch('/api/users', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },
  async create(data: any): Promise<any> {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create user');
    return res.json();
  },
};

// Posts API
export const postsAPI = {
  async getAll(): Promise<any[]> {
    const res = await fetch('/api/posts', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
  },
  async create(data: any): Promise<any> {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create post');
    return res.json();
  },
};

// Stations API
export const stationsAPI = {
  async getAll(): Promise<any[]> {
    const res = await fetch('/api/stations', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch stations');
    return res.json();
  },
  async create(data: any): Promise<any> {
    const res = await fetch('/api/stations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create station');
    return res.json();
  },
};

// Waste Analysis API
export const wasteAnalysisAPI = {
  async getAll(): Promise<any[]> {
    const res = await fetch('/api/waste-analysis', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch waste analyses');
    return res.json();
  },
  async create(data: any): Promise<any> {
    const res = await fetch('/api/waste-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create waste analysis');
    return res.json();
  },
};
