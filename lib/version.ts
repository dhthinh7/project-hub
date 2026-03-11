// App version configuration
// This version should match the version in package.json
export const APP_VERSION = "1.0.0";

// Minimum required server version (must match exactly)
export const REQUIRED_SERVER_VERSION = "1.0.0";

/**
 * Compare two version strings
 * Returns true if versions match, false otherwise
 */
export function compareVersions(version1: string, version2: string): boolean {
  return version1 === version2;
}
