export class BaseService<T extends { id: string }> {
  private storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  protected getAll(): T[] {
    const items = localStorage.getItem(this.storageKey);
    return items ? JSON.parse(items) : [];
  }

  protected save(items: T[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  async list(): Promise<T[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return this.getAll();
  }

  async create(item: Omit<T, 'id'>): Promise<T> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newItem = { ...item, id: Date.now().toString() } as T;
    const items = this.getAll();
    items.push(newItem);
    this.save(items);
    return newItem;
  }

  async update(id: string, item: Partial<T>): Promise<T> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const items = this.getAll();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Item not found');

    const updatedItem = { ...items[index], ...item } as T;
    items[index] = updatedItem;
    this.save(items);
    return updatedItem;
  }

  async delete(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const items = this.getAll();
    const filtered = items.filter((item) => item.id !== id);
    this.save(filtered);
  }

  async getById(id: string): Promise<T | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const items = this.getAll();
    return items.find((item) => item.id === id) || null;
  }
}