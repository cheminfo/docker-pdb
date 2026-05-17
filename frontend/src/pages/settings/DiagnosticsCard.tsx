import { Button, Card, ProgressBar, Spinner } from '@blueprintjs/core';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  fetchDiagnostics,
  fetchRenderThumbnailsStatus,
  triggerRenderThumbnails,
} from '../../shared/api/client.ts';
import type {
  DiagnosticsResponse,
  RenderThumbnailsState,
} from '../../shared/api/types.ts';

/** Poll the render job status every 2 s while it is running. */
const RENDER_POLL_INTERVAL_MS = 2_000;

type DiagStatus = 'idle' | 'loading' | 'done' | 'error';

/**
 * Settings card that shows a database-health snapshot (including full
 * assembly thumbnail coverage) and lets the operator render missing PNGs.
 *
 * Workflow:
 * 1. Click "Run diagnostics" → fetches `GET /v1/diagnostics`, which includes
 *    a full scan of all assembly entries for missing 200×200 thumbnails.
 * 2. If any are missing, "Render missing thumbnails" appears.
 * 3. Clicking it fires `POST /v1/fix/render-thumbnails` and polls
 *    `GET /v1/fix/render-thumbnails/status` every 2 s until done.
 * @returns DiagnosticsCard React element.
 */
export default function DiagnosticsCard() {
  const [diagStatus, setDiagStatus] = useState<DiagStatus>('idle');
  const [diag, setDiag] = useState<DiagnosticsResponse | null>(null);
  const [diagError, setDiagError] = useState<string | null>(null);

  const [renderState, setRenderState] = useState<RenderThumbnailsState | null>(
    null,
  );
  const [renderLoading, setRenderLoading] = useState(false);
  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollTimer.current) {
      clearTimeout(pollTimer.current);
      pollTimer.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    stopPolling();
    const tick = () => {
      fetchRenderThumbnailsStatus().then(
        ({ state }) => {
          setRenderState(state);
          if (state?.running) {
            pollTimer.current = setTimeout(tick, RENDER_POLL_INTERVAL_MS);
          }
        },
        () => {
          pollTimer.current = setTimeout(tick, RENDER_POLL_INTERVAL_MS);
        },
      );
    };
    tick();
  }, [stopPolling]);

  useEffect(() => () => stopPolling(), [stopPolling]);

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

  const handleRenderThumbnails = useCallback(() => {
    setRenderLoading(true);
    triggerRenderThumbnails().then(
      ({ state }) => {
        setRenderState(state);
        setRenderLoading(false);
        startPolling();
      },
      (error: unknown) => {
        setRenderLoading(false);
        setDiagError(error instanceof Error ? error.message : String(error));
      },
    );
  }, [startPolling]);

  const { database } = diag ?? {};
  const {
    emptyTitleCount = 0,
    pdbCount = 0,
    ftsTitleCount = 0,
    assemblyTotal = 0,
    assemblyMissing = 0,
  } = database ?? {};

  const renderProgress =
    renderState && renderState.total > 0
      ? renderState.processed / renderState.total
      : 0;

  const hasMissing = assemblyTotal > 0 && assemblyMissing > 0;

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
            {assemblyTotal === 0 ? (
              <span className="settings-muted">no assembly entries found</span>
            ) : (
              <span>
                {(assemblyTotal - assemblyMissing).toLocaleString()} /{' '}
                {assemblyTotal.toLocaleString()} have a PNG
                {assemblyMissing === 0 ? (
                  <span className="settings-ok"> ✓</span>
                ) : (
                  <span className="settings-muted">
                    {' '}
                    — {assemblyMissing.toLocaleString()} missing
                  </span>
                )}
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

      {diagStatus === 'done' && assemblyTotal > 0 ? (
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
