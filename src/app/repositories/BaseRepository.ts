const API_URL = "http://localhost:3001";

export class BaseRepository<T> {
  protected resource: string;

  constructor(resource: string) {
    this.resource = resource;
  }

  async getAll(): Promise<T[]> {
    const response = await fetch(`${API_URL}/${this.resource}`);
    if (!response.ok) throw new Error(`Failed to fetch ${this.resource}`);
    return response.json();
  }

  async getById(id: string): Promise<T> {
    const response = await fetch(`${API_URL}/${this.resource}/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch ${this.resource} with id ${id}`);
    return response.json();
  }

  async create(data: Partial<T>): Promise<T> {
    const response = await fetch(`${API_URL}/${this.resource}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Failed to create in ${this.resource}`);
    return response.json();
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const response = await fetch(`${API_URL}/${this.resource}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Failed to update in ${this.resource} with id ${id}`);
    return response.json();
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/${this.resource}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(`Failed to delete in ${this.resource} with id ${id}`);
  }
}
