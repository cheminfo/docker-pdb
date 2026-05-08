import type { DatabaseInfo, ViewResponse } from './types.ts';

/**
 * Fetch a JSON resource from the same origin and throw on a non-2xx response.
 * @param url - Relative URL to fetch.
 * @returns Parsed JSON body of the response.
 */
async function fetchJson<TResponse>(url: string): Promise<TResponse> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<TResponse>;
}

/**
 * Fetch CouchDB info for the `pdb` database (counts, disk size).
 * @returns Promise resolving to the database info document.
 */
export function fetchPdbInfo(): Promise<DatabaseInfo> {
  return fetchJson<DatabaseInfo>('/pdb/');
}

/**
 * Fetch CouchDB info for the `pdb-bio-assembly` database.
 * @returns Promise resolving to the database info document.
 */
export function fetchAssemblyInfo(): Promise<DatabaseInfo> {
  return fetchJson<DatabaseInfo>('/assembly/');
}

/**
 * Fetch the grouped `byYear` reduce view from `_design/stats`.
 * @returns Promise resolving to the rows of the view, keyed by year.
 */
export function fetchByYear(): Promise<ViewResponse<number>> {
  return fetchJson<ViewResponse<number>>('/stats/byYear?group=true');
}

/**
 * Fetch the grouped `byExperiment` reduce view from `_design/stats`.
 * @returns Promise resolving to the rows of the view, keyed by experimental method.
 */
export function fetchByExperiment(): Promise<ViewResponse<string>> {
  return fetchJson<ViewResponse<string>>('/stats/byExperiment?group=true');
}
