/**
 * SHA-256 hash a password using the Web Crypto API.
 * Returns a lowercase hex string.
 * @param {string} password - The password to hash.
 * @returns {Promise<string>} The hex-encoded SHA-256 hash.
 */
export async function hashPassword(password) {
  const encoded = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}
