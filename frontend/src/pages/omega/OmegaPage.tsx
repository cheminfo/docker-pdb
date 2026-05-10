import { Card } from '@blueprintjs/core';
import { useCallback, useMemo, useState } from 'react';

import DualRangeSlider from '../../shared/DualRangeSlider.tsx';
import {
  fetchOmegaByYear,
  fetchOmegaSummary,
  fetchPairFrequency,
} from '../../shared/api/client.ts';
import type {
  OmegaSummaryResponse,
  OmegaTuple,
} from '../../shared/api/types.ts';
import Panel from '../../shared/charts/Panel.tsx';
import { formatNumber } from '../../shared/format.ts';
import { useAsync } from '../../shared/useAsync.ts';

import CisHeatmap from './CisHeatmap.tsx';
import CisOverTimeChart from './CisOverTimeChart.tsx';

/**
 * `/omega` page: explore amide-bond ω torsion statistics across the PDB —
 * global counts, distribution over time, and a 20×20 amino-acid heatmap of
 * cis-bond probability filterable by deposition-year range.
 * @returns Omega-page React element.
 */
export default function OmegaPage() {
  const summaryState = useAsync(fetchOmegaSummary);
  const byYearState = useAsync(fetchOmegaByYear);

  const yearBounds = useMemo<[number, number] | null>(() => {
    if (byYearState.status !== 'success') return null;
    const years = byYearState.data.rows
      .map((row) => row.key)
      .filter((y) => Number.isFinite(y) && y >= 1970);
    if (years.length === 0) return null;
    return [Math.min(...years), Math.max(...years)];
  }, [byYearState]);

  const [yearRange, setYearRange] = useState<{
    min: number | null;
    max: number | null;
  }>({ min: null, max: null });

  const effectiveRange = useMemo<[number, number] | null>(() => {
    if (!yearBounds) return null;
    return [yearRange.min ?? yearBounds[0], yearRange.max ?? yearBounds[1]];
  }, [yearBounds, yearRange]);

  const isFullRange =
    !!effectiveRange &&
    !!yearBounds &&
    effectiveRange[0] === yearBounds[0] &&
    effectiveRange[1] === yearBounds[1];

  return (
    <div className="container omega-page">
      <header>
        <h1>Amide-bond geometry</h1>
        <p>
          For every consecutive residue pair, the parser computes the ω dihedral
          (Cα-C-N-Cα). Bonds with |ω| ≤ 30° are flagged as <strong>cis</strong>;
          |ω| ≥ 150° as <strong>trans</strong>; the rest are{' '}
          <strong>twisted</strong>. Below: global counts, distribution over
          time, and a 20×20 heatmap of cis probability per residue pair.
        </p>
      </header>

      <SummaryCards state={summaryState} />

      <div className="charts charts--single">
        <Panel
          title="Cis-bond percentage by deposition year"
          description="Bar height: nbCis / nbPeptideBonds within each year. Highlighted bars match the heatmap year range below."
          state={byYearState}
          errorPrefix="Could not load per-year ω stats"
        >
          {(data) => (
            <CisOverTimeChart
              data={data}
              highlightRange={
                isFullRange ? undefined : (effectiveRange ?? undefined)
              }
            />
          )}
        </Panel>
      </div>

      <h2>Cis probability per amino-acid pair</h2>
      <p className="omega-intro">
        Each cell shows P(cis) for the peptide bond between residue i and
        residue i+1 (rows = i, columns = i+1). Cells with fewer than 3 observed
        bonds are greyed out. The slider restricts the year range — drag to see
        how the picture evolves over time.
      </p>
      <YearRangeControl
        bounds={yearBounds}
        value={yearRange}
        onChange={setYearRange}
        effectiveRange={effectiveRange}
      />
      {effectiveRange === null ? (
        <Card className="panel omega-heatmap-panel">
          <h3>Cis probability heatmap (20 × 20)</h3>
          <p className="placeholder">Loading heatmap…</p>
        </Card>
      ) : (
        <HeatmapPanel range={effectiveRange} isFullRange={isFullRange} />
      )}
    </div>
  );
}

interface SummaryCardsProps {
  state: ReturnType<typeof useAsync<OmegaSummaryResponse>>;
}

function SummaryCards({ state }: SummaryCardsProps) {
  if (state.status !== 'success') {
    return (
      <div className="stats-grid">
        <Card className="stat-card" compact>
          <span className="label">Loading ω stats…</span>
        </Card>
      </div>
    );
  }
  const tuple: OmegaTuple = state.data.rows[0]?.value ?? [0, 0, 0, 0];
  const [nbCis, nbTrans, nbTwisted, nbBonds] = tuple;
  const cisPercent = nbBonds > 0 ? (nbCis / nbBonds) * 100 : 0;
  const twistedPercent = nbBonds > 0 ? (nbTwisted / nbBonds) * 100 : 0;
  return (
    <div className="stats-grid">
      <Card className="stat-card" compact>
        <span className="label">Peptide bonds</span>
        <span className="value">{formatNumber(nbBonds)}</span>
        <span className="sub">across the whole PDB</span>
      </Card>
      <Card className="stat-card" compact>
        <span className="label">Trans</span>
        <span className="value">{formatNumber(nbTrans)}</span>
        <span className="sub">|ω| ≥ 150°</span>
      </Card>
      <Card className="stat-card" compact>
        <span className="label">Cis</span>
        <span className="value">{formatNumber(nbCis)}</span>
        <span className="sub">{formatNumber(cisPercent, 3)} % of bonds</span>
      </Card>
      <Card className="stat-card" compact>
        <span className="label">Twisted</span>
        <span className="value">{formatNumber(nbTwisted)}</span>
        <span className="sub">
          {formatNumber(twistedPercent, 3)} % (30° &lt; |ω| &lt; 150°)
        </span>
      </Card>
    </div>
  );
}

interface YearRangeControlProps {
  bounds: [number, number] | null;
  value: { min: number | null; max: number | null };
  onChange: (next: { min: number | null; max: number | null }) => void;
  effectiveRange: [number, number] | null;
}

function YearRangeControl({
  bounds,
  value,
  onChange,
  effectiveRange,
}: YearRangeControlProps) {
  if (!bounds || !effectiveRange) {
    return <p className="placeholder">Loading year range…</p>;
  }
  return (
    <Card className="omega-year-control panel">
      <div className="omega-year-control-row">
        <span className="filter-group-label">Year range</span>
        <span className="filter-range-value">
          {effectiveRange[0]} – {effectiveRange[1]}
        </span>
      </div>
      <DualRangeSlider
        min={bounds[0]}
        max={bounds[1]}
        valueMin={value.min}
        valueMax={value.max}
        onChange={onChange}
      />
    </Card>
  );
}

interface HeatmapPanelProps {
  range: [number, number];
  isFullRange: boolean;
}

function HeatmapPanel({ range, isFullRange }: HeatmapPanelProps) {
  const fetchTask = useCallback(
    () => fetchPairFrequency(isFullRange ? undefined : range),
    [range, isFullRange],
  );

  const state = useAsync(fetchTask);

  return (
    <Panel
      title="Cis probability heatmap (20 × 20)"
      state={state}
      errorPrefix="Could not load heatmap"
    >
      {(data) => <CisHeatmap pairs={data} />}
    </Panel>
  );
}
