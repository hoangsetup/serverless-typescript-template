export interface IBaseRepo<T> {
  insert(params: any): Promise<T>;
  getById(id: any): Promise<T | null>;
  update(id: any, obj: any): Promise<T | null>;
  remove(id: any, preventCondition?: any): Promise<any>;
  query(params: any): Promise<T[]>;
}
