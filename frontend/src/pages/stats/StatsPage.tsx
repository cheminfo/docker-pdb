import AminoAcidChart from './AminoAcidChart.tsx';
import ChainsHistogramChart from './ChainsHistogramChart.tsx';
import CumulativeYearChart from './CumulativeYearChart.tsx';
import EcClassesChart from './EcClassesChart.tsx';
import HelicesVsSheetsChart from './HelicesVsSheetsChart.tsx';
import HelixKindChart from './HelixKindChart.tsx';
import HelixLengthChart from './HelixLengthChart.tsx';
import IepHistogramChart from './IepHistogramChart.tsx';
import LigandFrequencyChart from './LigandFrequencyChart.tsx';
import LigandMwChart from './LigandMwChart.tsx';
import LigandsByYearChart from './LigandsByYearChart.tsx';
import MethodByYearChart from './MethodByYearChart.tsx';
import ModifiedResiduesChart from './ModifiedResiduesChart.tsx';
import MoleculeTypeChart from './MoleculeTypeChart.tsx';
import NucleicBaseChart from './NucleicBaseChart.tsx';
import ResiduesByYearChart from './ResiduesByYearChart.tsx';
import ResiduesHistogramChart from './ResiduesHistogramChart.tsx';
import ResiduesPerChainCard from './ResiduesPerChainCard.tsx';
import SecondaryStructureChart from './SecondaryStructureChart.tsx';
import SheetLengthChart from './SheetLengthChart.tsx';

/**
 * Page rendered at `/stats`: 20 charts grouped into five sections that mine
 * the parsed-PDB metadata stored in SQLite. Each chart fetches its own
 * aggregated view from `/v1/stats/<view>`.
 * @returns Stats-page React element.
 */
export default function StatsPage() {
  return (
    <div className="container stats-page">
      <header>
        <h1>Statistics</h1>
        <p>
          Twenty charts mining the parsed-PDB metadata stored in SQLite —
          composition, secondary structure, size, ligands, biochemistry, and
          deposition trends. Each chart is computed by a single grouped SQL
          query and updates as new entries land.
        </p>
      </header>

      <h2>Composition</h2>
      <div className="charts">
        <AminoAcidChart />
        <NucleicBaseChart />
        <MoleculeTypeChart />
        <ModifiedResiduesChart />
      </div>

      <h2>Secondary structure</h2>
      <div className="charts">
        <HelixKindChart />
        <SecondaryStructureChart />
        <HelixLengthChart />
        <SheetLengthChart />
      </div>
      <div className="charts charts--single">
        <HelicesVsSheetsChart />
      </div>

      <h2>Size &amp; shape</h2>
      <div className="charts">
        <ResiduesHistogramChart />
        <ChainsHistogramChart />
        <ResiduesPerChainCard />
      </div>

      <h2>Ligands &amp; chemistry</h2>
      <div className="charts">
        <LigandMwChart />
        <LigandsByYearChart />
      </div>
      <div className="charts charts--single">
        <LigandFrequencyChart />
      </div>

      <h2>Biochemistry</h2>
      <div className="charts">
        <IepHistogramChart />
        <EcClassesChart />
      </div>

      <h2>Trends over time</h2>
      <div className="charts">
        <ResiduesByYearChart />
        <CumulativeYearChart />
      </div>
      <div className="charts charts--single">
        <MethodByYearChart />
      </div>
    </div>
  );
}
