import { Entity } from './entity.base';

export interface Mapper<E extends Entity, DbRecord> {
  toDocument(entity: E): DbRecord;
  toEntity(record: unknown): E;
}
