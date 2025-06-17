export type Success<T> = {
    success: true,
    data: T;
    error: null;
};

export type Failure<E> = {
    success: false
    data: null;
    error: E;
};

export type Result<T, E = Error> = Success<T> | Failure<E>;

export async function tryCatch<T, E = Error>(
    promise: Promise<T>,
    errorHandler?: (error: unknown) => E
): Promise<Result<T, E>> {
    try {
        const data = await promise;
        return { success: true, data, error: null } as Success<T>;
    } catch (error) {
        const processedError = errorHandler
            ? errorHandler(error)
            : error as E;

        return { success: false, data: null, error: processedError } as Failure<E>;
    }
}