import { Ok } from 'oxide.ts';

export interface SerializedException {
  message: string;
  code: string;
  metadata?: unknown;
}

export abstract class EntityExceptionBase extends Error {
  abstract code: string;

  /**
   * @param {string} message
   * @param {ObjectLiteral} [metadata={}]
   * @memberof ExceptionBase
   */
  constructor(
    override readonly message: string,
    readonly cause?: Error,
    readonly metadata?: unknown
  ) {
    super(message);
    this.cause = cause;
    this.metadata = metadata;
  }

  toJSON(): SerializedException {
    return {
      message: this.message,
      code: this.code,
      metadata: this.metadata,
    };
  }
}

export abstract class SubstantiateExceptionBase extends Error {
  abstract code: string;

  constructor(
    override readonly message: string,
    readonly fatal?: boolean,
    readonly metadata?: Record<string, unknown>
  ) {
    super(message);
    this.metadata = metadata;

    if (!fatal) {
      Object.assign(SubstantiateExceptionBase, { Ok: Ok(null) });
    }
  }

  toJSON() {
    return {
      message: this.message,
      code: this.code,
      metadata: this.metadata,
    };
  }
}
