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
  MUTABLE_EXPORT_EXCEPTION,
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

export class MutableExportException extends EntityExceptionBase {
  readonly code = MUTABLE_EXPORT_EXCEPTION;
  static readonly message =
    'Unable to export a Mutable Entity, please ensure you run .lock() first!';

  constructor(entityMetadata: EntityMetadata) {
    super(MutableExportException.message, undefined, {
      id: entityMetadata._id,
      entity: entityMetadata._name,
      state: entityMetadata._state,
      mutable: entityMetadata._mutable,
    });
  }
}

export class ValidationException extends EntityExceptionBase {
  readonly code = VALIDATION_ERROR;

  constructor(error: ValidationError, entityMetadata: EntityMetadata) {
    super(`Error Validating ${entityMetadata._name}`, error);
  }
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
