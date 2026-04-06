export interface ApiResponse<T> {
    status?: string /** The status of the response, e.g., 'success' or 'error'. */;
    data?: T /** The data returned in the response. */;
    message?: string /** A message providing additional information about the response. */;
    error?: string /** An error message, if applicable. */;
    code?: string /** An error code, if applicable. */;
    count?: number //* Number of Events in the Collection*/
}

/**
 * Creates a success response object.
 * @template T - The type of the data property.
 * @param {T} [data] - The data to include in the response.
 * @param {string} [message] - A message providing additional information about the response.
 * @param {number} [count] - Number of Events in the Collection.
 * @returns {ApiResponse<T | {}>} The success response object.
 */
export const successResponse = <T>(
    data?: T /** The data to include in the response. */,
    message?: string /** A message providing additional information about the response. */,
    count?: number //* Number of Events in the Collection*/
    ): ApiResponse<T> => ({
    message,
    count,
    data,
});