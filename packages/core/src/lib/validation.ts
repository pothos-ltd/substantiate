import { z } from 'zod';
import { CUID } from './types';
import { FieldValidationException } from './exceptions';
import { Result, Err, Ok } from 'oxide.ts';

export const isValidId = (id: CUID): Result<CUID, FieldValidationException> => {
  const schema = z.string().cuid2();

  try {
    schema.parse(id);
    return Ok(id);
  } catch (e) {
    return Err(new FieldValidationException(e));
  }
};
