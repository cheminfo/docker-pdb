import EndpointList from './EndpointList.tsx';

/**
 * Documentation page mounted at `/api`. Lists every public HTTP endpoint
 * exposed by the nginx proxy with a one-line description and a working
 * example.
 * @returns API documentation page React element.
 */
export default function ApiPage() {
  return (
    <div className="container">
      <header>
        <h1>HTTP API</h1>
        <p>
          All endpoints are read-only (<code>GET</code>/<code>HEAD</code>) and
          proxied to CouchDB by nginx. CORS is open so any browser can hit them
          directly.
        </p>
      </header>
      <EndpointList />
    </div>
  );
}
