// Dependencies
import { ZodError } from 'zod';
import { ValidationError } from 'zod-validation-error';

// Exceptions
import {
  EntityExceptionBase,
  SubstantiateExceptionBase,
} from './exception.base';
import {
  ARGUMENT_INVALID,
  ARGUMENT_NOT_PROVIDED,
  ARGUMENT_OUT_OF_RANGE,
  CONFLICT,
  FIELD_VALIDATION_ERROR,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  VALIDATION_ERROR,
} from './exception.code';
import { EntityMetadata } from './types';

export class ArgumentInvalidException extends EntityExceptionBase {
  readonly code = ARGUMENT_INVALID;

  constructor(message: string) {
    super(message);
  }
}

export class ArgumentNotProvidedException extends EntityExceptionBase {
  readonly code = ARGUMENT_NOT_PROVIDED;

  constructor() {
    super('Argument not provided');
  }
}

export class ArgumentOutOfRangeException extends EntityExceptionBase {
  readonly code = ARGUMENT_OUT_OF_RANGE;

  constructor(message: string) {
    super(message);
  }
}

export class ConflictException extends EntityExceptionBase {
  readonly code = CONFLICT;

  constructor(message: string) {
    super(message);
  }
}

export class NotFoundException extends EntityExceptionBase {
  static readonly message = 'Not found';

  constructor(message = NotFoundException.message) {
    super(message);
  }

  readonly code = NOT_FOUND;
}

export class InternalServerErrorException extends EntityExceptionBase {
  static readonly message = 'Internal server error';

  constructor(message = InternalServerErrorException.message) {
    super(message);
  }

  readonly code = INTERNAL_SERVER_ERROR;
}

export class ValidationException extends EntityExceptionBase {
  constructor(error: ValidationError, entityMetadata: EntityMetadata) {
    super(`Error Validating ${entityMetadata._name}`, error);
  }

  readonly code = VALIDATION_ERROR;
}

export class FieldValidationException extends SubstantiateExceptionBase {
  override readonly code = FIELD_VALIDATION_ERROR;
  readonly format: ZodError['format'];
  readonly path: (string | number)[];

  constructor(zodError: ZodError) {
    super(`${zodError.issues[0].message}`);
    this.format = zodError.format;
    this.path = zodError.errors[0].path;
  }
}
