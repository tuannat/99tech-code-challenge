import { database } from './database';
import { Resource, CreateResourceInput, UpdateResourceInput, ResourceFilters } from '../types/resource';

export class ResourceModel {
  static async create(input: CreateResourceInput): Promise<Resource> {
    const { name, description, category, status = 'active' } = input;
    const now = new Date().toISOString();
    
    const result = await database.run(
      `INSERT INTO resources (name, description, category, status, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, category, status, now, now]
    );

    const resource = await database.get(
      'SELECT * FROM resources WHERE id = ?',
      [result.lastID]
    );

    return resource as Resource;
  }

  static async findById(id: number): Promise<Resource | null> {
    const resource = await database.get(
      'SELECT * FROM resources WHERE id = ?',
      [id]
    );
    
    return resource || null;
  }

  static async findAll(filters: ResourceFilters = {}): Promise<Resource[]> {
    let sql = 'SELECT * FROM resources WHERE 1=1';
    const params: any[] = [];

    if (filters.category) {
      sql += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.search) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      const searchPattern = `%${filters.search}%`;
      params.push(searchPattern, searchPattern);
    }

    sql += ' ORDER BY createdAt DESC';

    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(filters.limit);
      
      if (filters.offset) {
        sql += ' OFFSET ?';
        params.push(filters.offset);
      }
    }

    const resources = await database.all(sql, params);
    return resources as Resource[];
  }

  static async update(id: number, input: UpdateResourceInput): Promise<Resource | null> {
    const existingResource = await this.findById(id);
    if (!existingResource) {
      return null;
    }

    const updateFields: string[] = [];
    const params: any[] = [];

    if (input.name !== undefined) {
      updateFields.push('name = ?');
      params.push(input.name);
    }

    if (input.description !== undefined) {
      updateFields.push('description = ?');
      params.push(input.description);
    }

    if (input.category !== undefined) {
      updateFields.push('category = ?');
      params.push(input.category);
    }

    if (input.status !== undefined) {
      updateFields.push('status = ?');
      params.push(input.status);
    }

    if (updateFields.length === 0) {
      return existingResource;
    }

    updateFields.push('updatedAt = ?');
    params.push(new Date().toISOString());
    params.push(id);

    const sql = `UPDATE resources SET ${updateFields.join(', ')} WHERE id = ?`;
    await database.run(sql, params);

    return await this.findById(id);
  }

  static async delete(id: number): Promise<boolean> {
    const result = await database.run(
      'DELETE FROM resources WHERE id = ?',
      [id]
    );

    return result.changes > 0;
  }

  static async count(filters: ResourceFilters = {}): Promise<number> {
    let sql = 'SELECT COUNT(*) as count FROM resources WHERE 1=1';
    const params: any[] = [];

    if (filters.category) {
      sql += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.search) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      const searchPattern = `%${filters.search}%`;
      params.push(searchPattern, searchPattern);
    }

    const result = await database.get(sql, params);
    return result.count;
  }
}