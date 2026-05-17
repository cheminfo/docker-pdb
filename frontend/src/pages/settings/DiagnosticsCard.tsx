import { Button, Card, ProgressBar, Spinner } from '@blueprintjs/core';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  fetchDiagnostics,
  fetchRenderThumbnailsStatus,
  fetchScanThumbnailsStatus,
  triggerRenderThumbnails,
  triggerScanThumbnails,
} from '../../shared/api/client.ts';
import type {
  DiagnosticsResponse,
  RenderThumbnailsState,
  ScanThumbnailsState,
} from '../../shared/api/types.ts';

/** Poll the scan / render job status every 2 s while it is running. */
const POLL_INTERVAL_MS = 2_000;

type DiagStatus = 'idle' | 'loading' | 'done' | 'error';

/**
 * Settings card that shows a database-health snapshot and lets the operator
 * scan thumbnail coverage and render missing PyMol thumbnails.
 *
 * Workflow:
 * 1. Click "Run diagnostics" → fetches `GET /v1/diagnostics`.
 * 2. Results show empty-title count and FTS coverage.
 * 3. Click "Scan thumbnails" → starts `POST /v1/fix/scan-thumbnails` and polls
 *    `GET /v1/fix/scan-thumbnails/status` every 2 s until done.
 * 4. Scan result shows how many of the N assembly entries have a PNG.
 * 5. If any are missing, "Render missing thumbnails" appears and works the
 *    same way via `POST /v1/fix/render-thumbnails`.
 * @returns DiagnosticsCard React element.
 */
export default function DiagnosticsCard() {
  const [diagStatus, setDiagStatus] = useState<DiagStatus>('idle');
  const [diag, setDiag] = useState<DiagnosticsResponse | null>(null);
  const [diagError, setDiagError] = useState<string | null>(null);

  const [scanState, setScanState] = useState<ScanThumbnailsState | null>(null);
  const [scanLoading, setScanLoading] = useState(false);
  const scanTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [renderState, setRenderState] = useState<RenderThumbnailsState | null>(
    null,
  );
  const [renderLoading, setRenderLoading] = useState(false);
  const renderTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopScanPolling = useCallback(() => {
    if (scanTimer.current) {
      clearTimeout(scanTimer.current);
      scanTimer.current = null;
    }
  }, []);

  const startScanPolling = useCallback(() => {
    stopScanPolling();
    const tick = () => {
      fetchScanThumbnailsStatus().then(
        ({ state }) => {
          setScanState(state);
          if (state?.running) {
            scanTimer.current = setTimeout(tick, POLL_INTERVAL_MS);
          }
        },
        () => {
          scanTimer.current = setTimeout(tick, POLL_INTERVAL_MS);
        },
      );
    };
    tick();
  }, [stopScanPolling]);

  const stopRenderPolling = useCallback(() => {
    if (renderTimer.current) {
      clearTimeout(renderTimer.current);
      renderTimer.current = null;
    }
  }, []);

  const startRenderPolling = useCallback(() => {
    stopRenderPolling();
    const tick = () => {
      fetchRenderThumbnailsStatus().then(
        ({ state }) => {
          setRenderState(state);
          if (state?.running) {
            renderTimer.current = setTimeout(tick, POLL_INTERVAL_MS);
          }
        },
        () => {
          renderTimer.current = setTimeout(tick, POLL_INTERVAL_MS);
        },
      );
    };
    tick();
  }, [stopRenderPolling]);

  useEffect(
    () => () => {
      stopScanPolling();
      stopRenderPolling();
    },
    [stopScanPolling, stopRenderPolling],
  );

  const handleRunDiagnostics = useCallback(() => {
    setDiagStatus('loading');
    setDiagError(null);
    fetchDiagnostics().then(
      (result) => {
        setDiag(result);
        setDiagStatus('done');
      },
      (error: unknown) => {
        setDiagError(error instanceof Error ? error.message : String(error));
        setDiagStatus('error');
      },
    );
  }, []);

  const handleScanThumbnails = useCallback(() => {
    setScanLoading(true);
    triggerScanThumbnails().then(
      ({ state }) => {
        setScanState(state);
        setScanLoading(false);
        startScanPolling();
      },
      (error: unknown) => {
        setScanLoading(false);
        setDiagError(error instanceof Error ? error.message : String(error));
      },
    );
  }, [startScanPolling]);

  const handleRenderThumbnails = useCallback(() => {
    setRenderLoading(true);
    triggerRenderThumbnails().then(
      ({ state }) => {
        setRenderState(state);
        setRenderLoading(false);
        startRenderPolling();
      },
      (error: unknown) => {
        setRenderLoading(false);
        setDiagError(error instanceof Error ? error.message : String(error));
      },
    );
  }, [startRenderPolling]);

  const { database } = diag ?? {};
  const {
    emptyTitleCount = 0,
    pdbCount = 0,
    ftsTitleCount = 0,
    assemblyCount = 0,
  } = database ?? {};

  const scanProgress =
    scanState && scanState.total > 0 ? scanState.scanned / scanState.total : 0;

  const renderProgress =
    renderState && renderState.total > 0
      ? renderState.processed / renderState.total
      : 0;

  const scanDone = scanState && !scanState.running;
  const hasMissing = scanDone && scanState.missing > 0;

  return (
    <Card className="panel">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <h3 style={{ margin: 0 }}>Database health</h3>
        <Button
          text="Run diagnostics"
          icon="diagnosis"
          loading={diagStatus === 'loading'}
          onClick={handleRunDiagnostics}
        />
      </div>

      {diagStatus === 'error' && diagError ? (
        <p className="placeholder">Error: {diagError}</p>
      ) : null}

      {diagStatus === 'done' && diag ? (
        <dl className="settings-sync-meta">
          <dt>PDB entries</dt>
          <dd>{pdbCount.toLocaleString()}</dd>

          <dt>Empty titles</dt>
          <dd>
            {emptyTitleCount === 0 ? (
              <span className="settings-ok">
                0 — all entries have a title ✓
              </span>
            ) : (
              <span>
                {emptyTitleCount.toLocaleString()} (
                {((emptyTitleCount / pdbCount) * 100).toFixed(2)}%) — PDB files
                without a TITLE record
              </span>
            )}
          </dd>

          <dt>FTS-indexed</dt>
          <dd>
            {ftsTitleCount.toLocaleString()}{' '}
            <span className="settings-muted">
              ({(pdbCount - emptyTitleCount).toLocaleString()} expected)
            </span>
          </dd>

          <dt>Assembly thumbnails</dt>
          <dd>
            {assemblyCount === 0 ? (
              <span className="settings-muted">no assembly entries found</span>
            ) : scanState ? (
              scanState.running ? (
                <span className="settings-muted">
                  Scanning… {scanState.scanned.toLocaleString()} /{' '}
                  {scanState.total.toLocaleString()}
                </span>
              ) : (
                <span>
                  {(scanState.total - scanState.missing).toLocaleString()} /{' '}
                  {scanState.total.toLocaleString()} have a PNG
                  {scanState.missing === 0 ? (
                    <span className="settings-ok"> ✓</span>
                  ) : (
                    <span className="settings-muted">
                      {' '}
                      — {scanState.missing.toLocaleString()} missing
                    </span>
                  )}
                </span>
              )
            ) : (
              <span className="settings-muted">
                {assemblyCount.toLocaleString()} entries —{' '}
                <Button
                  small
                  minimal
                  icon="search"
                  text="Scan all"
                  loading={scanLoading}
                  onClick={handleScanThumbnails}
                />
              </span>
            )}
          </dd>
        </dl>
      ) : null}

      {diagStatus === 'loading' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Spinner size={16} />
          <span className="settings-muted">Loading…</span>
        </div>
      ) : null}

      {scanState?.running ? (
        <div style={{ marginTop: 12 }}>
          <ProgressBar value={scanProgress} intent="primary" />
        </div>
      ) : null}

      {diagStatus === 'done' && assemblyCount > 0 && scanDone ? (
        <div style={{ marginTop: 16 }}>
          {renderState ? (
            <div>
              {renderState.running ? (
                <>
                  <p style={{ margin: '0 0 6px' }} className="settings-muted">
                    Rendering missing thumbnails…{' '}
                    {renderState.processed.toLocaleString()} /{' '}
                    {renderState.total.toLocaleString()}
                  </p>
                  <ProgressBar value={renderProgress} intent="primary" />
                  <p style={{ margin: '6px 0 0' }} className="settings-muted">
                    Rendered: {renderState.rendered.toLocaleString()} · Skipped:{' '}
                    {renderState.skipped.toLocaleString()} · Failed:{' '}
                    {renderState.failed.toLocaleString()}
                  </p>
                </>
              ) : (
                <p style={{ margin: 0 }}>
                  Done — rendered {renderState.rendered.toLocaleString()} new
                  PNG{renderState.rendered !== 1 ? 's' : ''}, skipped{' '}
                  {renderState.skipped.toLocaleString()} existing
                  {renderState.failed > 0
                    ? `, ${renderState.failed.toLocaleString()} failed`
                    : ''}
                  .
                </p>
              )}
            </div>
          ) : (
            <Button
              intent={hasMissing ? 'warning' : 'none'}
              icon="media"
              text="Render missing thumbnails"
              loading={renderLoading}
              onClick={handleRenderThumbnails}
            />
          )}
        </div>
      ) : null}
    </Card>
  );
}
