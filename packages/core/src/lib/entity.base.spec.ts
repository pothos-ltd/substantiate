// Dependencies
import { createId } from '@paralleldrive/cuid2';

// Test Data
import { TestEntitySchema } from './test-data';

// Exceptions
import { MutableExportException, ValidationException } from './exceptions';
import { SubstantiatedEntity } from './substantiated.entity';

describe('Entity Tests', () => {
  it('create successfully with correct parameters', () => {
    const id = createId();
    const model = SubstantiatedEntity.create({
      id,
      state: 'PENDING',
      props: {
        user_id: createId(),
      },
      schema: TestEntitySchema,
    });

    expect(model.validate().isOk()).toBeTruthy();
  });

  it('will throw an error with incorrect parameters', () => {
    try {
      const id = createId();
      SubstantiatedEntity.create({
        id,
        state: 'PENDING',
        props: {
          user_id: '', // Not a valid CUID2 as defined by the schema
        },
        schema: TestEntitySchema,
      });
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationException);
    }
  });

  it('should be able to convert into an object', () => {
    const user_id = createId();

    const model = SubstantiatedEntity.create({
      id: createId(),
      state: 'PENDING',
      props: {
        user_id,
      },
      schema: TestEntitySchema,
    });

    model.lock();
    const obj = model.toObject().unwrap();

    expect(obj).toStrictEqual({
      id: obj.id,
      state: 'PENDING',
      user_id,
    });
  });

  it('will throw an error when trying to export when mutable', () => {
    const id = createId();
    const model = SubstantiatedEntity.create({
      id,
      state: 'PENDING',
      props: {
        user_id: createId(),
      },
      schema: TestEntitySchema,
    });

    try {
      throw model.unlock().unwrap().toObject().unwrapErr();
    } catch (e) {
      expect(e).toBeInstanceOf(MutableExportException);
    }
  });
});
