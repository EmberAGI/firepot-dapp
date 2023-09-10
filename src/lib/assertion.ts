export function assertIsDefined<T>(property: string, value: T): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(`'${property}' is not defined`);
  }
}
