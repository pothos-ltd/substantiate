import { SubstantiatedEntity } from './substantiated.entity';

export interface Mapper<E extends SubstantiatedEntity, DbRecord> {
  toDocument(entity: E): DbRecord;
  toEntity(record: unknown): E;
}
