export type ApiResponseData<T> =
    | { success: true; data: T }
    | { success: false; error: string };

export const ApiResponse = {
    success<T>(data: T): ApiResponseData<T> {
        return { success: true, data };
    },

    failure<T>(error: string): ApiResponseData<T> {
        return { success: false, error };
    }
};