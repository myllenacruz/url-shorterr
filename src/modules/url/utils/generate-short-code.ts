import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique short code based on a UUID.
 * The generated code is derived from a UUID with all dashes removed, and truncated to the length specified by `environment` SHORT_CODE_LENGTH variable.
 * @returns {string} A short, unique code to be used in shortened URLs.
 */
export function generateShortCode(length: number): string {
    const uuid = uuidv4().replace(/-/g, '');
    const code = uuid.substring(0, length);
    return code;
}
