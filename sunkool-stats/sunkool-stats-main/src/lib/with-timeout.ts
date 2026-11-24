/** Thrown by withTimeout() when the promise did not settle in time. */
export class TimeoutError extends Error {
  constructor(message = "Timed out") {
    super(message);
    this.name = "TimeoutError";
  }
}

/**
 * Rejects with a TimeoutError if `promise` has not settled after `ms`. It does not cancel the work behind
 * the promise (a Server Action cannot be aborted from the client); the caller just stops waiting for it,
 * and a late result is ignored.
 */
export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new TimeoutError()), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}
