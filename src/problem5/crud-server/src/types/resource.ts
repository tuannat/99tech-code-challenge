export interface Resource {
  id: number;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateResourceInput {
  name: string;
  description: string;
  category: string;
  status?: 'active' | 'inactive';
}

export interface UpdateResourceInput {
  name?: string;
  description?: string;
  category?: string;
  status?: 'active' | 'inactive';
}

export interface ResourceFilters {
  category?: string;
  status?: 'active' | 'inactive';
  search?: string;
  limit?: number;
  offset?: number;
}