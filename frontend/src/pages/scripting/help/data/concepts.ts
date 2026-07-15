/**
 * Plain-language explanations of the JavaScript concepts a chemist or
 * biologist needs to read and write scripting-page scripts. Rendered as
 * collapsible cards by `HelpBasics.tsx`, and indexed by `search.ts`.
 *
 * Content, not code: each entry stays short, leads with a lab analogy, and
 * carries one small example the reader can paste into the editor.
 */

export interface Concept {
  id: string;
  /** Title shown on the collapsed row. */
  title: string;
  /** One-line summary shown next to the title while collapsed. */
  teaser: string;
  /** Explanation paragraphs, shown when expanded. */
  body: string[];
  /** Small illustrative example. */
  code?: string;
  /** The mistake everybody makes once. */
  gotcha?: string;
}

export const CONCEPTS: Concept[] = [
  {
    id: 'statements',
    title: 'A script is a list of instructions',
    teaser: 'The computer reads your script top to bottom, one line at a time.',
    body: [
      'Think of it as a lab protocol. Each line does exactly one thing, and nothing happens until the line before it has finished. Order matters for the same reason it does at the bench: you cannot stain a gel you have not run yet, and you cannot colour a structure you have not loaded yet.',
      'Every instruction ends with a semicolon. It is the full stop at the end of the sentence.',
    ],
    code: `const ms = new MolStar();      // 1. switch the microscope on
const pdb = ms.loadPDB(text);  // 2. put the sample on the stage
pdb.select('PLP').focus();     // 3. zoom in on the ligand`,
  },
  {
    id: 'comments',
    title: 'Comments — notes to yourself',
    teaser: 'Anything after // is ignored by the computer.',
    body: [
      'Comments are free, and they are the difference between a script you can reuse next year and one you rewrite from scratch. Explain *why* you picked a residue — the code already says which one.',
    ],
    code: `// Lys residue that forms the Schiff base with PLP.
pdb.select('LYS.NZ').atoms.color('red');`,
  },
  {
    id: 'variables',
    title: 'Variables — giving a name to something',
    teaser: 'const pocket = ... lets you name a thing once and reuse it.',
    body: [
      '`const` is short for *constant*: you are giving a permanent name to something so you can refer to it later. Read the `=` as “is”, not as a mathematical equality. `const pocket = pdb.select(\'within 5 of PLP\')` reads as “let *pocket* be the atoms within 5 Å of PLP”.',
      'Two reasons to bother: you type the expression once instead of five times, and the name records your intent. `pocket` tells the next reader what you meant; the raw expression does not.',
    ],
    code: `// Without a variable — the same expression typed three times:
pdb.select('within 5 of PLP').atoms.color('gold');
pdb.select('within 5 of PLP').bonds.diameter(0.2);
pdb.select('within 5 of PLP').focus();

// With a variable — named once, used three times:
const pocket = pdb.select('within 5 of PLP');
pocket.atoms.color('gold');
pocket.bonds.diameter(0.2);
pocket.focus();`,
    gotcha:
      'Pick a name and spell it identically every time: `pocket` and `Pocket` are two different names.',
  },
  {
    id: 'strings',
    title: 'Text values — always in quotes',
    teaser: "'PLP' with quotes is text. PLP without quotes is an error.",
    body: [
      'Selection expressions, colours and titles are all text, so they go in quotes. Single or double quotes both work — just be consistent.',
      'The `+` sign glues two pieces of text together, which is how you build a title out of a fixed part and a value.',
    ],
    code: `pdb.select('PLP');   // ✓ text — the residue code
pdb.select(PLP);     // ✗ error: PLP is not defined

ms.echo('Chain ' + pdb.chains[0]);   // shows "Chain A"`,
  },
  {
    id: 'numbers',
    title: 'Numbers — no quotes',
    teaser: "3.5 is a number. '3.5' is text, and the API wants the number.",
    body: [
      'Distances are in ångströms, times in seconds, and sizes are multipliers on a default (so `1` means “normal size”, `2` means “twice as big”). None of them take quotes.',
    ],
    code: `pdb.select('108-122:A').bonds.diameter(0.15);  // Å-ish thickness
delay(2);                                      // wait 2 seconds`,
  },
  {
    id: 'dot',
    title: 'The dot — “belonging to”',
    teaser: "Read a.b as “the b of a”, or “ask a to do b”.",
    body: [
      'This is the single most important piece of syntax on the page, and it is simpler than it looks. A dot means “inside” or “belonging to”, and you read the line left to right like a sentence.',
      '`pdb.chains` is “the chains of pdb”. `pdb.select(\'PLP\')` is “ask pdb to select PLP”. Chain them together and you get one readable sentence: “ask pdb to select PLP, take its atoms layer, and colour it green”.',
    ],
    code: `pdb.select('PLP').atoms.color('limegreen');
//  └── which atoms ──┘ └─ how ─┘ └── what colour ──┘`,
  },
  {
    id: 'parentheses',
    title: 'Parentheses — a fact versus an action',
    teaser: 'No parentheses = reading a fact. Parentheses = doing something.',
    body: [
      'Some things are facts you look up, and they have no parentheses: `pdb.chains` is simply the list of chain names. Other things are actions you ask for, and those always take parentheses — even when there is nothing to put inside them.',
      'Forgetting the parentheses on an action is silent: nothing happens, and you get no error. You handed someone the recipe instead of asking them to cook.',
    ],
    code: `pdb.chains          // a fact:  ['A', 'B']
pdb.chains.length   // a fact:  2

ms.resetCamera();   // an action — the () is what runs it
ms.resetCamera;     // does nothing at all, and says nothing`,
  },
  {
    id: 'arguments',
    title: 'Arguments — what goes in the parentheses',
    teaser: "The values an action needs: delay(2) means “wait 2 seconds”.",
    body: [
      'Whatever you put between the parentheses is passed to the action. Order matters, and some values are optional — when you leave one out, a sensible default is used.',
    ],
    code: `delay(2);            // one value
ms.spin('y', 60);    // two: first the axis, then the speed
ms.spin('y');        // speed left out → defaults to 30 deg/s`,
  },
  {
    id: 'options',
    title: 'Options — settings that carry their own label',
    teaser: "{ size: 30, color: 'navy' } is a labelled list of settings.",
    body: [
      'When an action has many optional settings, they are passed together inside curly braces, each with its name. Think of it as a reagent table rather than a queue: because every value is labelled, the order is irrelevant and you only mention the ones you care about.',
    ],
    code: `ms.echo('Active site', { size: 30, color: 'navy' });
ms.echo('Active site', { color: 'navy', size: 30 });  // identical
ms.echo('Active site');                               // all defaults`,
    gotcha:
      'Inside curly braces you use a colon (`size: 30`), and separate settings with commas. Outside them you use `=`.',
  },
  {
    id: 'chaining',
    title: 'Chaining — several settings on one line',
    teaser: 'Drawing methods hand the layer back, so you can keep adding dots.',
    body: [
      '`.diameter(0.4)` gives you the same bonds layer back, so you can immediately call `.color(...)` on it. Chaining and splitting produce exactly the same result — chain while the line stays readable, split when it gets long.',
    ],
    code: `// chained
cys.bonds.diameter(0.4).color({ model: 'atoms' });

// split — identical result
cys.bonds.diameter(0.4);
cys.bonds.color({ model: 'atoms' });`,
  },
  {
    id: 'arrays',
    title: 'Lists — many things in order',
    teaser: 'pdb.chains is a list. [0] is the first one, .length is how many.',
    body: [
      'A list holds several values in order. You reach one by its position in square brackets, and ask how many there are with `.length`.',
      'Counting starts at **0**, not 1. This catches everyone exactly once: the first chain is `pdb.chains[0]`, and the last is `pdb.chains[pdb.chains.length - 1]`.',
    ],
    code: `pdb.chains          // ['A', 'B']
pdb.chains[0]       // 'A'  ← the first one
pdb.chains[1]       // 'B'
pdb.chains.length   // 2
pdb.helices.length  // how many HELIX records the file declares`,
  },
  {
    id: 'loops',
    title: 'Loops — do the same thing to every item',
    teaser: 'A for loop repeats a block once per chain, per residue, per anything.',
    body: [
      'Read `for (let i = 0; i < pdb.chains.length; i++)` as “for each position *i*, starting at 0, while *i* is still below the number of chains, adding 1 each time”. Inside the braces, `i` is the position you are currently on.',
      'This is where scripting decisively beats clicking: colouring 2 chains and colouring 200 is the same three lines.',
    ],
    code: `const colors = ['steelblue', 'salmon', 'mediumseagreen'];
for (let i = 0; i < pdb.chains.length; i++) {
  pdb.select(':' + pdb.chains[i]).ribbon.color(colors[i % colors.length]);
}`,
    gotcha:
      '`i % colors.length` is the remainder after division — it wraps back to the start of the colour list, so you never run out of colours.',
  },
  {
    id: 'case',
    title: 'Capitals matter (except inside a selection)',
    teaser: "loadPDB works, loadpdb does not — but 'plp' and 'PLP' are the same.",
    body: [
      'JavaScript is strict about capitals: `pdb.loadPDB` and `pdb.loadpdb` are different names, and only one exists.',
      'Selection *text* is the forgiving exception. Inside the quotes, capitals are ignored — `\'plp\'`, `\'PLP\'`, `\'Protein\'` and `\'protein\'` all work. The rule is: inside the quotes it is relaxed, outside the quotes it is not.',
    ],
    code: `pdb.select('plp');      // ✓ same as 'PLP'
pdb.select('PROTEIN');  // ✓ same as 'protein'
pdb.selectt('PLP');     // ✗ error: no such action`,
  },
  {
    id: 'await',
    title: 'You do not need to write await',
    teaser: 'Other tutorials say await everywhere. Here it is added for you.',
    body: [
      'Some of these actions genuinely take time — a 3-second rotation, a surface calculation. In ordinary JavaScript you would have to mark each one with `await` or things would run out of order.',
      'The scripting page rewrites your script and inserts `await` for you, so you can write a flat list of steps and trust it runs in order. If you already know what `await` does, you can write it explicitly and nothing will break.',
    ],
    code: `ms.rotate({ degrees: 180 });   // finishes before the next line starts
ms.echo('Now facing the other way');`,
  },
  {
    id: 'errors',
    title: 'Errors are information, not failure',
    teaser: 'Read the first line of the red message — it names the problem.',
    body: [
      '**“X is not defined”** — usually a missing pair of quotes (`select(PLP)` instead of `select(\'PLP\')`), or a typo in a variable name.',
      '**“… is not a function”** — a typo in the action name, or a capital in the wrong place (`loadpdb` instead of `loadPDB`).',
      '**Nothing appears on the canvas** — not an error at all. Usually the selection matched no atoms: the residue code is absent from this file, or the file declares no HELIX records. Check with `ms.echo(pdb.ligands.join(\' \'))` to see what is actually there.',
    ],
    code: `// See what this structure actually contains before selecting from it:
ms.echo('Chains: ' + pdb.chains.join(' ') +
        ' | Ligands: ' + pdb.ligands.join(' '));`,
  },
];
