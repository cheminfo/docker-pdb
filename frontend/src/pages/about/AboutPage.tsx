import { Card } from '@blueprintjs/core';

/**
 * About page mounted at `/about`. Explains what pdb.cheminfo.org is, links
 * to the upstream wwPDB resources it mirrors, and lists the citations the
 * wwPDB asks downstream consumers to use when publishing work that relies
 * on PDB data.
 * @returns About page React element.
 */
export default function AboutPage() {
  return (
    <div className="container about-page">
      <header>
        <h1>About pdb.cheminfo.org</h1>
        <p>
          A self-hosted, fast, read-only mirror of the worldwide Protein Data
          Bank. Every entry is parsed once into SQLite and rendered once into
          PyMol thumbnails so structure metadata and previews are served
          straight from disk — no on-the-fly rendering, no upstream lookup.
        </p>
      </header>

      <h2>The Protein Data Bank</h2>
      <Card className="panel about-panel">
        <p>
          The{' '}
          <a
            href="https://www.wwpdb.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            worldwide Protein Data Bank (wwPDB)
          </a>{' '}
          is the single global archive of experimentally-determined
          three-dimensional structures of proteins, nucleic acids, and complex
          assemblies. Established in 1971 and operated as an international
          consortium since 2003, the archive currently holds well over 200,000
          entries and is the cornerstone reference data set for structural
          biology, drug discovery, and bioinformatics worldwide.
        </p>
        <p>
          All structural data shown by this site originates from the wwPDB
          archive, distributed under the{' '}
          <a
            href="https://creativecommons.org/publicdomain/zero/1.0/"
            target="_blank"
            rel="noopener noreferrer"
          >
            CC0 1.0 Universal (Public Domain Dedication)
          </a>{' '}
          license. We re-distribute it unchanged; we add a search index, a
          unified HTTP API, and pre-rendered thumbnails on top.
        </p>
      </Card>

      <h2>Acknowledgements</h2>
      <Card className="panel about-panel">
        <p>
          pdb.cheminfo.org would not exist without the decades of work done by
          the wwPDB partner organizations, who curate, validate, and freely
          distribute every entry in the archive. We are deeply grateful for that
          ongoing effort. Please visit and support them directly:
        </p>
        <ul className="about-links">
          <li>
            <a
              href="https://www.rcsb.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              RCSB PDB
            </a>{' '}
            — Research Collaboratory for Structural Bioinformatics, USA.
          </li>
          <li>
            <a
              href="https://www.ebi.ac.uk/pdbe/"
              target="_blank"
              rel="noopener noreferrer"
            >
              PDBe
            </a>{' '}
            — Protein Data Bank in Europe, EMBL-EBI, UK.
          </li>
          <li>
            <a
              href="https://pdbj.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              PDBj
            </a>{' '}
            — Protein Data Bank Japan, Osaka University.
          </li>
          <li>
            <a
              href="https://bmrb.io/"
              target="_blank"
              rel="noopener noreferrer"
            >
              BMRB
            </a>{' '}
            — Biological Magnetic Resonance Data Bank, USA.
          </li>
          <li>
            <a
              href="https://www.ebi.ac.uk/emdb/"
              target="_blank"
              rel="noopener noreferrer"
            >
              EMDB
            </a>{' '}
            — Electron Microscopy Data Bank, partner archive for cryo-EM maps.
          </li>
        </ul>
        <p>
          Every entry is mirrored daily from <code>rsync.wwpdb.org</code>. If
          you use this site for serious research, please consider going directly
          to the wwPDB partner sites: they offer richer search, validation
          reports, and the authoritative version of every record.
        </p>
        <p>
          Every interactive 3D structure on this site is rendered in the browser
          by{' '}
          <a
            href="https://molstar.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mol*
          </a>
          , the open-source molecular visualization toolkit jointly developed by
          PDBe and RCSB PDB. We are grateful to the Mol* team for making such a
          powerful viewer freely available. If you use figures or views
          generated through this site in a publication, please also cite:
        </p>
        <p className="about-citations">
          <strong>
            Sehnal, D., Bittrich, S., Deshpande, M., Svobodová, R., Berka, K.,
            Bazgier, V., Velankar, S., Burley, S. K., Koča, J. &amp; Rose, A. S.
          </strong>{' '}
          Mol*: Towards a common library and tools for web molecular graphics.{' '}
          <em>Nucleic Acids Research</em> 49, W431–W437 (2021).{' '}
          <a
            href="https://doi.org/10.1093/nar/gkab314"
            target="_blank"
            rel="noopener noreferrer"
          >
            doi:10.1093/nar/gkab314
          </a>
        </p>
      </Card>

      <h2>How to cite</h2>
      <Card className="panel about-panel">
        <p>
          If you use data obtained through pdb.cheminfo.org in a publication,
          you must cite the underlying wwPDB archive — not this site. The wwPDB
          asks that the following references be used:
        </p>
        <ol className="about-citations">
          <li>
            <strong>wwPDB consortium.</strong> Protein Data Bank: the single
            global archive for 3D macromolecular structure data.{' '}
            <em>Nucleic Acids Research</em> 47, D520–D528 (2019).{' '}
            <a
              href="https://doi.org/10.1093/nar/gky949"
              target="_blank"
              rel="noopener noreferrer"
            >
              doi:10.1093/nar/gky949
            </a>
          </li>
          <li>
            <strong>Berman, H. M., Henrick, K. &amp; Nakamura, H.</strong>{' '}
            Announcing the worldwide Protein Data Bank.{' '}
            <em>Nature Structural Biology</em> 10, 980 (2003).{' '}
            <a
              href="https://doi.org/10.1038/nsb1203-980"
              target="_blank"
              rel="noopener noreferrer"
            >
              doi:10.1038/nsb1203-980
            </a>
          </li>
          <li>
            <strong>
              Berman, H. M., Westbrook, J., Feng, Z., Gilliland, G., Bhat, T.
              N., Weissig, H., Shindyalov, I. N. &amp; Bourne, P. E.
            </strong>{' '}
            The Protein Data Bank. <em>Nucleic Acids Research</em> 28, 235–242
            (2000).{' '}
            <a
              href="https://doi.org/10.1093/nar/28.1.235"
              target="_blank"
              rel="noopener noreferrer"
            >
              doi:10.1093/nar/28.1.235
            </a>
          </li>
        </ol>
        <p>
          You should also cite the primary publication associated with each
          individual PDB entry you use; the citation is listed in the entry
          header (<code>JRNL</code> records). For policy details see the{' '}
          <a
            href="https://www.wwpdb.org/about/usage-policies"
            target="_blank"
            rel="noopener noreferrer"
          >
            wwPDB usage policies
          </a>
          .
        </p>
      </Card>

      <h2>Tools we build on</h2>
      <Card className="panel about-panel">
        <p>
          Beyond the data itself, this site relies on several outstanding
          open-source projects:
        </p>
        <ul className="about-links">
          <li>
            <a
              href="https://molstar.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mol*
            </a>{' '}
            — the in-browser 3D structure viewer used on every entry page.
          </li>
          <li>
            <a
              href="https://pymol.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              PyMOL
            </a>{' '}
            — used to pre-render the thumbnail images.
          </li>
          <li>
            <a
              href="https://www.sqlite.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              SQLite
            </a>{' '}
            — the embedded database that holds every parsed entry, ligand
            fingerprint, and rsync run.
          </li>
          <li>
            <a
              href="https://github.com/cheminfo"
              target="_blank"
              rel="noopener noreferrer"
            >
              cheminfo
            </a>{' '}
            — parsing utilities and the maintainers of this project.
          </li>
        </ul>
        <p>
          The source code is released under an open license and lives at{' '}
          <a
            href="https://github.com/cheminfo/docker-pdb"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/cheminfo/docker-pdb
          </a>
          .
        </p>
      </Card>
    </div>
  );
}
