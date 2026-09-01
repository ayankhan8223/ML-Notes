import katex from 'katex';
import 'katex/dist/katex.min.css';

const officialSources = {
  gate2024: 'https://gate2024.iisc.ac.in/wp-content/uploads/2024/DA24S1.pdf',
  gate2024Key: 'https://gate2026.iitg.ac.in/doc/download/2024/DAFinalAnswerKey.pdf',
  gate2025: 'https://gate2025.iitr.ac.in/doc/2025/2025_QP/DA.pdf',
  gate2026: 'https://gate2026.iitg.ac.in/doc/download/2026/QPs/DA.pdf',
  gate2026Key: 'https://gate2026.iitg.ac.in/doc/download/2026/Keys/DA_Keys.pdf'
};

const sourceLink = (href, label) => `<a href="${href}" target="_blank" rel="noreferrer">${label}</a>`;

const pyqCard = ({ year, questionNumber, topic, source, question, decoder, solution, recognition, trap, answer, supporting = false }) => `
  <article class="panel gate-pyq ${supporting ? 'supporting-pyq' : ''}" style="margin-top:15px">
    <div class="pyq-kicker">${supporting ? 'PCA-SUPPORTING ACTUAL PYQ' : 'CONCEPT CHECK — ACTUAL GATE PYQ'}</div>
    <h3>GATE DA ${year} — Q${questionNumber}</h3>
    <div class="pyq-meta"><span><strong>Source / year:</strong> ${source}</span><span><strong>Topic tested:</strong> ${topic}</span></div>
    <h4>Question</h4>${question}
    <h4>Before solving — notation decoder</h4>${decoder}
    <h4>Step-by-step solution</h4>${solution}
    <div class="grid-2 pyq-exam-boxes">
      <div class="callout teal"><strong>GATE fast recognition — 5–10 sec:</strong><br>${recognition}</div>
      <div class="callout gold"><strong>Common trap:</strong><br>${trap}</div>
    </div>
    <div class="pyq-answer"><strong>Final answer:</strong> ${answer}</div>
  </article>`;

const pcaStyle = document.createElement('style');
pcaStyle.textContent = `
  .chapter-part { margin-top: 18px; padding: 10px 14px; border-left: 4px solid var(--accent, #55c8c4); color: #55c8c4; letter-spacing: .08em; text-transform: uppercase; font-weight: 800; }
  .gate-pyq { border-color: rgba(244, 190, 92, .55); }
  .gate-pyq.supporting-pyq { border-color: rgba(98, 169, 255, .45); }
  .pyq-kicker { display:inline-block; margin-bottom:8px; padding:5px 9px; border-radius:999px; background:rgba(244,190,92,.13); color:#f4be5c; font:700 .76rem/1.2 Inter,sans-serif; letter-spacing:.07em; }
  .supporting-pyq .pyq-kicker { background:rgba(98,169,255,.13); color:#62a9ff; }
  .pyq-meta { display:flex; flex-wrap:wrap; gap:10px 22px; margin:8px 0 16px; color:var(--muted, #a9c2be); }
  .notation-grid, .object-map { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:10px; }
  .notation-grid > div, .object-map > div { padding:12px; border:1px solid rgba(120,160,165,.28); border-radius:10px; background:rgba(5,25,29,.25); }
  .notation-grid code, .object-map code { display:block; margin-bottom:7px; color:#55c8c4; font-size:1rem; }
  .notation-grid .notation-description { display:block; color:var(--ink-2, #c8d6d1); line-height:1.5; }
  .pca-foundation { display:grid; grid-template-columns:minmax(0,1fr); gap:18px; min-width:0; }
  .pca-foundation-intro, .pca-foundation-symbol { min-width:0; padding:20px; border:1px solid rgba(120,160,165,.34); border-radius:13px; background:linear-gradient(145deg,rgba(8,35,40,.52),rgba(5,25,29,.28)); }
  .pca-foundation-symbol { display:grid; gap:14px; }
  .pca-foundation-symbol h4 { margin:0; color:var(--ink,#edf4f0); font-size:1.18rem; }
  .pca-foundation-symbol p { margin:0; }
  .pca-foundation .table-wrap { width:100%; max-width:100%; margin:8px 0 2px; overflow-x:auto; }
  .pca-foundation .pca-math-display { margin:4px 0; }
  .pca-foundation-example { padding:12px 14px; border-radius:10px; background:rgba(85,200,196,.09); border-left:4px solid #55c8c4; }
  .pca-foundation-breakdown { display:grid; grid-template-columns:repeat(auto-fit,minmax(210px,1fr)); gap:9px; }
  .pca-foundation-breakdown > div { padding:10px 12px; border-radius:9px; background:rgba(131,182,239,.09); }
  .pca-foundation-trap, .pca-foundation-memory { padding:12px 14px; border-radius:10px; }
  .pca-foundation-trap { background:rgba(229,185,105,.12); border-left:4px solid var(--gold,#e5b969); }
  .pca-foundation-memory { background:rgba(255,128,104,.11); border-left:4px solid var(--coral,#ff8068); font-weight:700; }
  .pca-foundation-two { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
  .pca-foundation-flow { display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:10px; padding:14px; border-radius:10px; background:rgba(85,200,196,.08); font-weight:700; }
  .pca-foundation-flow .arrow { color:#55c8c4; font-size:1.35rem; }
  .pca-foundation-master th:first-child, .pca-foundation-master td:first-child { white-space:nowrap; }
  .pca-foundation-master td:first-child { color:#55c8c4; font-weight:800; }
  .pca-derivation-deep { display:grid; gap:16px; }
  .pca-running-example, .pca-derivation-step { min-width:0; padding:17px 18px; border:1px solid rgba(120,160,165,.32); border-radius:12px; background:rgba(5,25,29,.26); }
  .pca-running-example { border-color:rgba(85,200,196,.46); background:rgba(85,200,196,.07); }
  .pca-derivation-step { display:grid; gap:12px; }
  .pca-derivation-step p { margin:0; }
  .pca-step-kicker { width:max-content; padding:5px 9px; border-radius:999px; color:#55c8c4; background:rgba(85,200,196,.13); font-size:.76rem; font-weight:850; letter-spacing:.08em; }
  .pca-derivation-math + .pca-derivation-math { margin-top:8px; }
  .pca-what, .pca-old-concept, .pca-result-match { padding:12px 14px; border-radius:10px; }
  .pca-what { border-left:4px solid var(--coral,#ff8068); background:rgba(255,128,104,.10); }
  .pca-old-concept { border-left:4px solid var(--blue,#83b6ef); background:rgba(131,182,239,.10); }
  .pca-result-match { border:1px solid rgba(85,200,196,.48); background:rgba(85,200,196,.12); color:var(--ink,#edf4f0); font-weight:750; }
  .pca-result-match .match-arrow { display:inline-block; margin:0 10px; color:#55c8c4; font-size:1.25rem; }
  .pca-derivation-two { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
  .pca-derivation-two > div { min-width:0; padding:13px; border-radius:10px; background:rgba(131,182,239,.08); }
  .pca-final-summary { display:grid; gap:16px; margin-top:15px; border-color:rgba(85,200,196,.62); background:linear-gradient(145deg,rgba(11,43,48,.96),rgba(7,29,34,.96)); }
  .pca-final-summary > h3 { margin-bottom:0; }
  .pca-summary-intro { margin:0; color:var(--muted,#a9c2be); }
  .pca-summary-card { min-width:0; padding:17px 18px; border:1px solid rgba(120,160,165,.32); border-radius:12px; background:rgba(5,25,29,.30); }
  .pca-summary-card h4 { margin:0 0 12px; color:var(--ink,#edf4f0); font-size:1.08rem; }
  .pca-summary-flow { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:10px; align-items:stretch; }
  .pca-summary-flow > div { position:relative; min-width:0; padding:13px 11px; border:1px solid rgba(85,200,196,.34); border-radius:10px; background:rgba(85,200,196,.08); text-align:center; }
  .pca-summary-flow > div:not(:last-child)::after { content:'→'; position:absolute; right:-11px; top:50%; z-index:2; transform:translate(50%,-50%); color:#ff8068; font-size:1.25rem; font-weight:900; }
  .pca-summary-flow > div:nth-child(4)::after { content:'↓'; right:50%; top:auto; bottom:-11px; transform:translate(50%,50%); }
  .pca-summary-flow > div:nth-child(5) { grid-column:4; }
  .pca-summary-flow > div:nth-child(6) { grid-column:3; grid-row:2; }
  .pca-summary-flow > div:nth-child(7) { grid-column:2; grid-row:2; }
  .pca-summary-flow > div:nth-child(8) { grid-column:1; grid-row:2; }
  .pca-summary-flow > div:nth-child(5)::after,
  .pca-summary-flow > div:nth-child(6)::after,
  .pca-summary-flow > div:nth-child(7)::after { content:'←'; left:-11px; right:auto; transform:translate(-50%,-50%); }
  .pca-summary-flow strong { display:block; margin-bottom:5px; color:#55c8c4; }
  .pca-summary-memory-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; }
  .pca-summary-memory { min-width:0; padding:13px 14px; border-left:4px solid #ff8068; border-radius:10px; background:rgba(255,128,104,.10); }
  .pca-summary-memory strong { color:#ff9a86; }
  .pca-summary-two { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
  .pca-summary-two > div { min-width:0; padding:13px; border-radius:10px; background:rgba(131,182,239,.08); }
  .pca-summary-dimensions { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:9px; }
  .pca-summary-dimensions > div { padding:13px 10px; border-radius:10px; background:rgba(85,200,196,.09); text-align:center; }
  .pca-summary-dimensions strong { display:block; color:#55c8c4; font-size:1.05rem; }
  .pca-summary-card .table-wrap { margin:0; }
  .pca-summary-card table td:first-child { color:#55c8c4; font-weight:750; white-space:nowrap; }
  .pca-summary-card .pca-math-display { margin:10px 0; }
  .pca-summary-checklist { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px 24px; margin:0; padding-left:22px; }
  .pca-summary-checklist li { padding-left:3px; }
  .pca-summary-example { border-color:rgba(244,190,92,.48); background:rgba(244,190,92,.06); }
  .pca-summary-end { padding:14px; border-radius:10px; background:rgba(85,200,196,.13); border:1px solid rgba(85,200,196,.45); text-align:center; font-weight:800; }
  body.light .pca-running-example, body.light .pca-derivation-step { background:#f5faf9; }
  body.light .pca-final-summary { background:linear-gradient(145deg,#f7fbfa,#eef6f4); }
  body.light .pca-summary-card { background:#f5faf9; }
  body.light .pca-foundation-intro, body.light .pca-foundation-symbol { background:linear-gradient(145deg,#f7fbfa,#eef6f4); }
  @media (max-width:760px) {
    .pca-foundation-intro, .pca-foundation-symbol { padding:15px; }
    .pca-foundation-two { grid-template-columns:1fr; }
    .pca-foundation-master { min-width:640px; }
    .pca-foundation .pca-math-display .katex { font-size:1.08em; }
    .pca-foundation .pca-math-display.major .katex { font-size:1.18em; }
    .pca-foundation .pca-math-display.derivation .katex { font-size:1.06em; }
    .pca-running-example, .pca-derivation-step { padding:14px; }
    .pca-derivation-two { grid-template-columns:1fr; }
    .pca-summary-flow { grid-template-columns:1fr; }
    .pca-summary-flow > div:nth-child(n) { grid-column:auto; grid-row:auto; }
    .pca-summary-flow > div:not(:last-child)::after { content:'↓'; right:auto; left:50%; top:auto; bottom:-13px; transform:translate(-50%,50%); }
    .pca-summary-memory-grid, .pca-summary-two, .pca-summary-checklist { grid-template-columns:1fr; }
    .pca-summary-dimensions { grid-template-columns:repeat(2,minmax(0,1fr)); }
    .pca-summary-card { padding:14px; }
    .pca-summary-card table { min-width:620px; }
    .pca-derivation-deep .pca-math-display .katex { font-size:1.05em; }
    .pca-derivation-deep .pca-math-display.major .katex { font-size:1.16em; }
    .pca-derivation-deep .pca-math-display.derivation .katex { font-size:1.04em; }
  }
  .pyq-exam-boxes { margin-top:12px; }
  .pyq-answer { margin-top:12px; padding:12px 14px; border-radius:10px; background:rgba(85,200,196,.12); color:#dff8f4; font-size:1.04rem; }
  .code-map td:first-child { min-width:210px; }
  .code-map code { white-space:normal; }
  .shape-equation { text-align:center; font-size:1.08rem; }
  .pca-checklist { columns:2; column-gap:34px; }
  .pca-checklist li { break-inside:avoid; margin-bottom:8px; }
  .pca-source-note { font-size:.9rem; color:var(--muted, #a9c2be); }
  .pca-math-display { margin:16px 0; padding:22px 24px; overflow-x:auto; overflow-y:hidden; border:1px solid rgba(85,200,196,.42); border-radius:11px; background:linear-gradient(135deg,rgba(14,57,61,.78),rgba(8,34,38,.82)); color:#eafbf8; text-align:center; -webkit-overflow-scrolling:touch; }
  .pca-math-display .katex-display { margin:0; min-width:max-content; }
  .pca-math-display .katex { font-size:1.52em; line-height:1.35; }
  .pca-math-display.major { padding:25px 28px; border-color:rgba(244,190,92,.52); box-shadow:inset 0 0 0 1px rgba(244,190,92,.08); }
  .pca-math-display.major .katex { font-size:1.78em; }
  .pca-math-display.derivation .katex { font-size:1.48em; }
  .pca-math-label { margin:-8px 0 18px; color:var(--muted,#a9c2be); text-align:center; font-size:.92rem; }
  .pca-math-inline { display:inline-block; margin:0 .08em; color:#dff8f4; font-family:KaTeX_Main,serif; font-size:1.1em; vertical-align:-.08em; }
  .pca-math-inline .katex { font-size:1.08em; }
  .pca-shape-stack { display:grid; gap:12px; margin:16px 0; }
  .pca-shape-stack .pca-math-display { margin:0; }
  body.light .pca-math-display { background:linear-gradient(135deg,#eef9f8,#e2f3f1); color:#12383a; }
  body.light .pca-math-inline { color:#12383a; }
  @media (max-width:760px) { .pca-checklist { columns:1; } }
  @media (max-width:760px) {
    .pca-math-display { padding:18px 16px; }
    .pca-math-display .katex { font-size:1.23em; }
    .pca-math-display.major .katex { font-size:1.4em; }
    .pca-math-display.derivation .katex { font-size:1.18em; }
    .pca-math-inline, .pca-math-inline .katex { font-size:1.03em; }
  }
`;
document.head.append(pcaStyle);

const lecture47 = document.querySelector('#lecture-47');
if (lecture47 && !lecture47.querySelector('.gate-2024-pca')) {
  const firstPanel = lecture47.querySelector('article.panel');
  const gate2024 = document.createElement('div');
  gate2024.className = 'gate-2024-pca';
  gate2024.innerHTML = pyqCard({
    year: 2024,
    questionNumber: 18,
    topic: 'PCA purpose; dimensionality reduction',
    source: `${sourceLink(officialSources.gate2024, 'official question paper')} · ${sourceLink(officialSources.gate2024Key, 'official answer key')}`,
    question: `<p>Column 1 ko Column 2 se match karo:</p><div class="table-wrap"><table><thead><tr><th>Column 1</th><th>Column 2</th></tr></thead><tbody><tr><td>(p) Principal Component Analysis</td><td>(i) Discriminative Model</td></tr><tr><td>(q) Naïve Bayes Classification</td><td>(ii) Dimensionality Reduction</td></tr><tr><td>(r) Logistic Regression</td><td>(iii) Generative Model</td></tr></tbody></table></div><p>Options: A p–iii, q–i, r–ii · B p–ii, q–i, r–iii · C p–ii, q–iii, r–i · D p–iii, q–ii, r–i</p>`,
    decoder: `<div class="notation-grid"><div><code>PCA</code>Labels ke bina new compact features banane wali unsupervised feature-extraction technique.</div><div><code>Generative model</code>Class aur features ki data-generating probability model karta hai.</div><div><code>Discriminative model</code>Class boundary ya P(y|x) directly learn karta hai.</div></div>`,
    solution: `<ol><li>PCA original features ko principal components me convert karke dimensions reduce karta hai: <strong>p → ii</strong>.</li><li>Naïve Bayes class-conditional distributions model karta hai: <strong>q → iii</strong>.</li><li>Logistic Regression decision probability/boundary learn karta hai: <strong>r → i</strong>.</li></ol><div class="callout teal"><strong>Why PCA is unsupervised:</strong> PCA components calculate karte waqt target labels <code>y</code> use nahi hote. Labels baad me visualization ko color karne ya model train karne ke kaam aa sakte hain.</div>`,
    recognition: 'PCA dikhe to pehla association: unsupervised + feature extraction + dimensionality reduction.',
    trap: 'PCA ko classifier samajhna, ya labels visualization me dikhne ki wajah se supervised samajhna.',
    answer: '<strong>Option C</strong>: p–ii, q–iii, r–i.'
  });
  firstPanel?.after(gate2024);
}

const gate2025Card = pyqCard({
  year: 2025,
  questionNumber: 60,
  topic: 'Maximum projected variance; covariance eigenvalue',
  source: sourceLink(officialSources.gate2025, 'official IIT Roorkee question paper'),
  question: `<p>Let <code>D = {x⁽¹⁾,…,x⁽ⁿ⁾}</code> be a dataset of <code>n</code> observations where each <code>x⁽ⁱ⁾ ∈ ℝ¹⁰⁰</code>. It is given that <code>Σᵢ x⁽ⁱ⁾ = 0</code>. The covariance matrix computed from D has eigenvalues <code>λᵢ = 100^(2−i)</code>, <code>1 ≤ i ≤ 100</code>. Let <code>u ∈ ℝ¹⁰⁰</code> be the direction of maximum variance with <code>uᵀu = 1</code>.</p><div class="formula">Find: (1/n) Σᵢ (uᵀx⁽ⁱ⁾)²</div><p>(Numerical Answer Type; integer)</p>`,
  decoder: `<div class="notation-grid"><div><code>D = {x⁽¹⁾,…,x⁽ⁿ⁾}</code>Complete dataset.</div><div><code>x⁽ⁱ⁾</code>i-th observation; superscript index hai, exponent nahi.</div><div><code>x⁽ⁱ⁾ ∈ ℝ¹⁰⁰</code>Har one observation me 100 features/dimensions hain.</div><div><code>n</code>Observations/rows ki count; 100 se independent hai.</div><div><code>Σᵢx⁽ⁱ⁾ = 0</code>Mean vector zero: data already centered hai.</div><div><code>u</code>Maximum-variance candidate direction.</div><div><code>uᵀu = 1</code>u unit vector hai.</div><div><code>uᵀx⁽ⁱ⁾</code>Point i ka u-axis par scalar coordinate.</div><div><code>λᵢ</code>Covariance matrix ka i-th eigenvalue; corresponding PC variance.</div></div>`,
  solution: `<ol><li><strong>Centering decode:</strong> <code>Σᵢx⁽ⁱ⁾ = 0 ⇒ x̄ = (1/n)Σᵢx⁽ⁱ⁾ = 0</code>.</li><li>Projected scalar define karo: <code>zᵢ = uᵀx⁽ⁱ⁾</code>.</li><li>Projected mean: <code>z̄ = uᵀx̄ = 0</code>.</li><li>Isliye <code>(1/n)Σᵢ(uᵀx⁽ⁱ⁾)² = (1/n)Σᵢ(zᵢ−z̄)²</code>; ye projection-on-u ki variance hai.</li><li>u maximum-variance unit direction hai, so ye variance covariance matrix ki largest eigenvalue <code>λmax</code> hogi.</li><li><code>λ₁ = 100^(2−1)=100</code>, <code>λ₂=100⁰=1</code>, <code>λ₃=100⁻¹=0.01</code>… Hence <code>λmax=100</code>.</li></ol><div class="callout gold"><strong>Convention note:</strong> Is PYQ ka displayed <code>1/n</code> expression population-variance convention use karta hai. NumPy <code>np.cov</code> default sample covariance <code>1/(n−1)</code> use karta hai. Formula aur supplied eigenvalues ko same convention me compare karo.</div>`,
  recognition: 'Centered data + unit maximum-variance direction + average squared projection = directly λmax.',
  trap: '100 ko observations samajhna. Here 100 = features per observation; n = observations. Ya saare eigenvalues sum kar dena, jab question maximum direction pooch raha hai.',
  answer: '<strong>100</strong>.'
});

const gate2026Card = pyqCard({
  year: 2026,
  questionNumber: 11,
  topic: 'Orthogonality of principal components',
  source: `${sourceLink(officialSources.gate2026, 'official question paper')} · ${sourceLink(officialSources.gate2026Key, 'official answer key')}`,
  question: `<p>PCA ne feature space ko 100 se 10 dimensions me reduce kiya. First aur tenth principal components ke beech angle <code>θ</code> kya hai?</p><p>A <code>0°</code> · B <code>90°</code> · C <code>90° &lt; θ ≤ 180°</code> · D <code>0° &lt; θ &lt; 90°</code></p>`,
  decoder: `<div class="notation-grid"><div><code>PC1</code>Largest eigenvalue wali unit eigenvector direction.</div><div><code>PC10</code>Retained orthonormal PCA basis ki tenth direction.</div><div><code>θ</code>In two component directions ke beech angle.</div><div><code>100 → 10</code>100 original features me se top 10 PCs retained; observations ki count nahi.</div></div>`,
  solution: `<p>Covariance matrix <code>S</code> symmetric hoti hai. Symmetric matrix ke distinct-eigenvalue eigenvectors orthogonal hote hain; repeated eigenvalue ho tab bhi orthonormal eigenbasis choose ki ja sakti hai. PCA components isi orthonormal basis ke directions hain.</p><div class="formula">PC₁ᵀPC₁₀ = 0<br>cos θ = (PC₁ᵀPC₁₀)/(||PC₁|| ||PC₁₀||) = 0<br>θ = 90°</div>`,
  recognition: 'Different PCA components ⇒ orthogonal unit directions ⇒ dot product 0 ⇒ angle 90°.',
  trap: 'PC1 aur PC10 ko original feature columns samajhna, ya “both capture same data” so angle small assume karna.',
  answer: '<strong>Option B: 90°</strong>.'
});

const lecture48 = document.querySelector('#lecture-48');
if (lecture48) {
  lecture48.querySelector('.section-intro').textContent = 'Projection se covariance, covariance se eigenvectors, aur eigenvalues se maximum-variance PCs—complete derivation with actual GATE DA checks.';
  lecture48.querySelectorAll(':scope > article, :scope > details').forEach((node) => node.remove());
  lecture48.insertAdjacentHTML('beforeend', `
    <div class="chapter-part">Part B — Mathematical foundation</div>
    <article class="panel pca-foundation-panel">
      <h3>Symbols pehle decode karo</h3>
      <p>Formal notation se pehle ek hi chhote dataset ko pakadte hain. Har symbol ko isi table se connect karke padhenge.</p>
      <div class="pca-foundation">
        <section class="pca-foundation-intro">
          <h4>Common toy dataset — 4 students, 3 input features</h4>
          <div class="table-wrap"><table><thead><tr><th>Row / Observation</th><th>Age</th><th>Height</th><th>Weight</th></tr></thead><tbody><tr><td>1</td><td>20</td><td>170</td><td>60</td></tr><tr><td>2</td><td>22</td><td>175</td><td>65</td></tr><tr><td>3</td><td>21</td><td>168</td><td>58</td></tr><tr><td>4</td><td>25</td><td>180</td><td>72</td></tr></tbody></table></div>
          <div class="pca-foundation-flow"><span>4 rows</span><span class="arrow">→</span><span>n = 4 observations</span><span class="arrow">|</span><span>3 input columns</span><span class="arrow">→</span><span>p = 3 features</span></div>
          <div class="pca-foundation-math" data-math="dataset-matrix"></div>
          <p><strong>Plain language:</strong> X poora input dataset hai. Isme rows students/observations hain aur columns Age, Height, Weight features hain.</p>
        </section>

        <section class="pca-foundation-symbol">
          <h4>1. n aur p — pehle dataset ki shape padho</h4>
          <div class="table-wrap"><table><thead><tr><th>Symbol</th><th>Toy dataset me</th><th>Count kiski?</th></tr></thead><tbody><tr><td>n</td><td>4</td><td>Observations / rows</td></tr><tr><td>p</td><td>3</td><td>Input features / columns</td></tr></tbody></table></div>
          <p><strong>Plain language:</strong> n batata hai kitne examples hain; p batata hai har example ko describe karne ke liye kitni input values hain.</p>
          <div class="pca-foundation-math" data-math="x-general-shape"></div>
          <div class="pca-foundation-breakdown"><div><strong>n</strong><br>Total rows/observations.</div><div><strong>p</strong><br>Total input feature columns.</div><div><strong>n × p</strong><br>Rows × columns.</div></div>
          <div class="pca-foundation-example"><strong>Numeric example:</strong> n = 500 aur p = 100 ho, to X ki shape 500 × 100 hogi: 500 observations, aur har observation me 100 feature values.</div>
          <div class="pca-foundation-trap"><strong>Common trap:</strong> p = 100 ka matlab 100 observations nahi hai. Iska matlab har observation ke paas 100 input feature values hain.</div>
          <div class="pca-foundation-memory">Memory: n = kitni rows; p = har row me kitne input features.</div>
        </section>

        <section class="pca-foundation-symbol">
          <h4>2. Feature = input column</h4>
          <div class="table-wrap"><table><thead><tr><th>Age</th><th>Height</th><th>Weight</th><th>Purchased</th></tr></thead><tbody><tr><td>25</td><td>180</td><td>72</td><td>Yes</td></tr></tbody></table></div>
          <p><strong>Plain language:</strong> Normal tabular ML dataset me row ek observation hoti hai aur input column ek feature hota hai. Age, Height, Weight teen features hain; [25, 180, 72] ek observation hai.</p>
          <div class="pca-foundation-two"><div class="pca-foundation-example"><strong>Input matrix X:</strong><br>Age, Height, Weight</div><div class="pca-foundation-example"><strong>Target y:</strong><br>Purchased</div></div>
          <div class="pca-foundation-trap"><strong>Target nuance:</strong> Agar Purchased, Survived ya Price target/label column hai, PCA normally sirf input feature matrix X par lagta hai. Is example me p = 3 hai, 4 nahi.</div>
          <div class="pca-foundation-memory">Memory: rows = observations; input columns = features; target y ko p me count nahi karte.</div>
        </section>

        <section class="pca-foundation-symbol">
          <h4>3. x⁽ⁱ⁾ ∈ ℝᵖ — ek particular observation</h4>
          <div class="table-wrap"><table><thead><tr><th>Selected row</th><th>Age</th><th>Height</th><th>Weight</th></tr></thead><tbody><tr><td>4</td><td>25</td><td>180</td><td>72</td></tr></tbody></table></div>
          <p><strong>Plain language:</strong> x⁽⁴⁾ ka matlab dataset ki fourth observation/row hai.</p>
          <div class="pca-foundation-math" data-math="row-four"></div>
          <div class="pca-foundation-breakdown"><div><strong>i = 4</strong><br>Kaunsi observation? Fourth row.</div><div><strong>p = 3</strong><br>Us row me kitni feature values? Three.</div><div><strong>x⁽⁴⁾</strong><br>[25, 180, 72].</div></div>
          <div class="pca-foundation-example"><strong>General numeric example:</strong> i = 4 aur p = 30 ho to x⁽⁴⁾ ∈ ℝ³⁰ ka matlab: “fourth observation/row has 30 input feature values.”</div>
          <div class="pca-foundation-trap"><strong>Common trap:</strong> x⁽ⁱ⁾, x raised to power i nahi hai. Parentheses wala superscript (i) observation index hai.</div>
          <div class="pca-foundation-memory">i = which row &nbsp; | &nbsp; p = how many feature values in that row</div>
        </section>

        <section class="pca-foundation-symbol">
          <h4>4. ℝᵖ — p real-number components</h4>
          <div class="table-wrap"><table><thead><tr><th>Real-number examples</th><th>One vector in ℝ³</th></tr></thead><tbody><tr><td>−2, 0, 3.5, 100, √2</td><td>[25, 180, 72]</td></tr></tbody></table></div>
          <p><strong>Plain language:</strong> ℝ real numbers ka set hai. ℝ³ ka matlab three real-number components wala vector.</p>
          <div class="pca-foundation-math" data-math="real-space"></div>
          <div class="pca-foundation-breakdown"><div><strong>ℝ</strong><br>Allowed values real numbers hain.</div><div><strong>Power p</strong><br>Vector me p components hain.</div><div><strong>ML translation</strong><br>One observation has p numerical features.</div></div>
          <div class="pca-foundation-example"><strong>Numeric example:</strong> [25, 180, 72] me 3 real values hain, isliye fourth row ℝ³ me belong karti hai.</div>
          <div class="pca-foundation-trap"><strong>Common trap:</strong> ℝᵖ observations ki count nahi batata; ye ek observation/vector ki length batata hai.</div>
          <div class="pca-foundation-memory">Memory: ℝᵖ = one observation contains p real-valued feature values.</div>
        </section>

        <section class="pca-foundation-symbol">
          <h4>5. X ∈ ℝⁿˣᵖ — complete dataset matrix</h4>
          <div class="table-wrap"><table><thead><tr><th>Matrix part</th><th>Toy dataset</th><th>Meaning</th></tr></thead><tbody><tr><td>Rows</td><td>4</td><td>Observations</td></tr><tr><td>Columns</td><td>3</td><td>Features</td></tr></tbody></table></div>
          <p><strong>Plain language:</strong> Capital X poora input dataset hai, jabki small x⁽ⁱ⁾ us dataset ki sirf ek row hai.</p>
          <div class="pca-foundation-math" data-math="x-specific-general"></div>
          <div class="pca-foundation-breakdown"><div><strong>X</strong><br>Complete input matrix.</div><div><strong>n</strong><br>Number of rows.</div><div><strong>p</strong><br>Number of feature columns.</div></div>
          <div class="pca-foundation-example"><strong>Numeric example:</strong> Hamare table ke liye X ∈ ℝ⁴ˣ³.</div>
          <div class="pca-foundation-trap"><strong>Common trap:</strong> X aur x⁽ⁱ⁾ same cheez nahi: X complete matrix hai; x⁽ⁱ⁾ X ki i-th row hai.</div>
          <div class="pca-foundation-memory">Memory: capital X = all rows; small x⁽ⁱ⁾ = one selected row.</div>
        </section>

        <section class="pca-foundation-symbol">
          <h4>6. μ ∈ ℝᵖ — feature-wise mean vector</h4>
          <div class="table-wrap"><table><thead><tr><th>Feature</th><th>Mean</th></tr></thead><tbody><tr><td>Age</td><td>22</td></tr><tr><td>Height</td><td>173.25</td></tr><tr><td>Weight</td><td>63.75</td></tr></tbody></table></div>
          <p><strong>Plain language:</strong> Har feature column ka alag mean nikalta hai; un sab means ko ek vector me rakhne par μ milta hai.</p>
          <div class="pca-foundation-math" data-math="mean-vector"></div>
          <div class="pca-foundation-breakdown"><div><strong>μ</strong><br>Feature-wise mean vector.</div><div><strong>μⱼ</strong><br>j-th feature column ka mean.</div><div><strong>ℝᵖ</strong><br>p features ke liye p means.</div></div>
          <div class="pca-foundation-example"><strong>Numeric example:</strong> μ = [22, 173.25, 63.75]; isme Age, Height aur Weight ka one mean each hai.</div>
          <div class="pca-foundation-trap"><strong>Common trap:</strong> μ ek single overall mean nahi; PCA me ye normally feature-wise vector hai.</div>
          <div class="pca-foundation-memory">p features → p means → μ has p values.</div>
        </section>

        <section class="pca-foundation-symbol">
          <h4>7. Xc = X − μ — mean-centered dataset</h4>
          <div class="table-wrap"><table><thead><tr><th>Fourth row</th><th>Age</th><th>Height</th><th>Weight</th></tr></thead><tbody><tr><td>x⁽⁴⁾</td><td>25</td><td>180</td><td>72</td></tr><tr><td>μ</td><td>22</td><td>173.25</td><td>63.75</td></tr><tr><td>Centered</td><td>3</td><td>6.75</td><td>8.25</td></tr></tbody></table></div>
          <p><strong>Plain language:</strong> Har row se same feature-wise mean vector subtract hota hai. Result Xc centered dataset hai.</p>
          <div class="pca-foundation-math" data-math="centering-row"></div>
          <div class="pca-foundation-breakdown"><div><strong>X</strong><br>Original rows.</div><div><strong>μ</strong><br>Har feature ka mean.</div><div><strong>Xc</strong><br>Mean-subtracted rows.</div></div>
          <div class="pca-foundation-example"><strong>Numeric example:</strong> Fourth centered row [3, 6.75, 8.25] hai.</div>
          <div class="pca-foundation-trap"><strong>Common trap:</strong> Matrix notation me μ ek hi row se nahi, X ki every row se feature-wise subtract hota hai (broadcasting).</div>
          <div class="pca-foundation-memory">Memory: centering = every feature value − that feature's mean.</div>
        </section>

        <section class="pca-foundation-symbol">
          <h4>8. u ∈ ℝᵖ — candidate direction</h4>
          <div class="table-wrap"><table><thead><tr><th>Feature space</th><th>Direction components</th></tr></thead><tbody><tr><td>Age, Height, Weight (p = 3)</td><td>u₁, u₂, u₃</td></tr></tbody></table></div>
          <p><strong>Plain language:</strong> u us direction ko represent karta hai jis par PCA observations ko project karke spread check kar sakta hai.</p>
          <div class="pca-foundation-math" data-math="u-direction"></div>
          <div class="pca-foundation-breakdown"><div><strong>u</strong><br>Candidate direction.</div><div><strong>p components</strong><br>Same p-feature space me direction.</div><div><strong>uᵀu = 1</strong><br>Direction ki length one.</div></div>
          <div class="pca-foundation-example"><strong>Numeric example:</strong> p = 100 ho to u ∈ ℝ¹⁰⁰, kyunki direction ko bhi 100 feature-axis components chahiye.</div>
          <div class="pca-foundation-trap"><strong>Common trap:</strong> u data ki row nahi; feature space me ek direction hai. PCA optimization me ise unit vector rakhte hain.</div>
          <div class="pca-foundation-memory">Memory: observation aur projection direction dono same p-dimensional feature space me live karte hain.</div>
        </section>

        <section class="pca-foundation-symbol">
          <h4>9. zᵢ = uᵀx⁽ⁱ⁾ — one scalar projection score</h4>
          <div class="table-wrap"><table><thead><tr><th>2D observation</th><th>Direction</th><th>Projected coordinate</th></tr></thead><tbody><tr><td>[3, 2]ᵀ</td><td>[1, 0]ᵀ</td><td>3</td></tr></tbody></table></div>
          <p><strong>Plain language:</strong> zᵢ i-th observation ka direction u ke along 1D coordinate/score hai. Output ek number—scalar—hota hai.</p>
          <div class="pca-foundation-math" data-math="projection-score"></div>
          <div class="pca-foundation-breakdown"><div><strong>z₁</strong><br>Observation 1 ka score.</div><div><strong>z₂</strong><br>Observation 2 ka score.</div><div><strong>zᵢ</strong><br>Observation i ka score.</div></div>
          <div class="pca-foundation-example"><strong>Numeric example:</strong> [1, 0] direction x-coordinate ko pick karti hai, isliye [3, 2] ka projection score 3 hai.</div>
          <div class="pca-foundation-trap"><strong>Common trap:</strong> zᵢ vector nahi; ye scalar coordinate hai. Vector projection alag expression hoti hai.</div>
          <div class="pca-foundation-memory">Memory: one row + one direction → one scalar PCA coordinate.</div>
        </section>

        <section class="pca-foundation-symbol">
          <h4>10. C ∈ ℝᵖˣᵖ — covariance matrix</h4>
          <div class="table-wrap"><table><thead><tr><th></th><th>Age</th><th>Height</th><th>Weight</th></tr></thead><tbody><tr><th>Age</th><td>Var(Age)</td><td>Cov(Age, Height)</td><td>Cov(Age, Weight)</td></tr><tr><th>Height</th><td>Cov(Height, Age)</td><td>Var(Height)</td><td>Cov(Height, Weight)</td></tr><tr><th>Weight</th><td>Cov(Weight, Age)</td><td>Cov(Weight, Height)</td><td>Var(Weight)</td></tr></tbody></table></div>
          <p><strong>Plain language:</strong> Covariance matrix every feature ko every feature se compare karti hai. p features hon to p × p comparisons bante hain.</p>
          <div class="pca-foundation-math" data-math="covariance-three"></div>
          <div class="pca-foundation-breakdown"><div><strong>Diagonal</strong><br>Each feature ki variance.</div><div><strong>Off-diagonal</strong><br>Feature pairs ki covariance.</div><div><strong>Shape</strong><br>p × p.</div></div>
          <div class="pca-foundation-example"><strong>Numeric shape example:</strong> p = 3, so C ∈ ℝ³ˣ³.</div>
          <div class="pca-foundation-trap"><strong>Common trap:</strong> n covariance estimate karne ke liye observations ki count deta hai; matrix ki final dimensions p decide karta hai.</div>
          <div class="pca-foundation-memory">p features → p × p covariance matrix.</div>
        </section>

        <section class="pca-foundation-symbol">
          <h4>11. v aur λ — direction alag, amount alag</h4>
          <div class="table-wrap"><table><thead><tr><th>Symbol</th><th>General linear algebra</th><th>PCA covariance context</th></tr></thead><tbody><tr><td>v</td><td>Eigenvector / special direction</td><td>Principal-component direction</td></tr><tr><td>λ</td><td>Eigenvalue / scaling amount</td><td>Unit v ke along variance amount</td></tr></tbody></table></div>
          <p><strong>Plain language:</strong> v batata hai special direction kahan hai; λ batata hai matrix us direction ko kitne factor se scale karta hai.</p>
          <div class="pca-foundation-math" data-math="eigen-relation"></div>
          <div class="pca-foundation-breakdown"><div><strong>C</strong><br>Covariance matrix.</div><div><strong>v</strong><br>Eigenvector / WHERE.</div><div><strong>λ</strong><br>Eigenvalue / HOW MUCH.</div></div>
          <div class="pca-foundation-example"><strong>PCA-specific meaning:</strong> Jab C covariance matrix ho aur v unit eigenvector ho, tab λ us v direction ke along projected variance hota hai.</div>
          <div class="pca-foundation-trap"><strong>Common trap:</strong> “Eigenvalue always means variance” false hai. λ ko variance tab interpret karte hain jab matrix covariance C ho aur eigenvector unit-length ho.</div>
          <div class="pca-foundation-memory">v = WHERE &nbsp; | &nbsp; λ = HOW MUCH variance (for covariance matrix C).</div>
        </section>

        <section class="pca-foundation-symbol">
          <h4>Final master table</h4>
          <div class="table-wrap"><table class="pca-foundation-master"><thead><tr><th>Notation</th><th>Meaning</th><th>Example</th></tr></thead><tbody><tr><td>n</td><td>Total observations</td><td>4</td></tr><tr><td>p</td><td>Total input features</td><td>3</td></tr><tr><td>X</td><td>Complete dataset</td><td>4 × 3 matrix</td></tr><tr><td>x⁽ⁱ⁾</td><td>i-th observation</td><td>x⁽⁴⁾ = [25, 180, 72]</td></tr><tr><td>ℝᵖ</td><td>p real-valued components</td><td>ℝ³</td></tr><tr><td>μ</td><td>Feature-wise mean vector</td><td>3 values</td></tr><tr><td>Xc</td><td>Centered dataset</td><td>X − μ</td></tr><tr><td>u</td><td>Candidate/unit direction</td><td>p components</td></tr><tr><td>zᵢ</td><td>i-th observation's scalar projection</td><td>uᵀx⁽ⁱ⁾</td></tr><tr><td>C</td><td>Covariance matrix</td><td>p × p</td></tr><tr><td>v</td><td>Eigenvector / PC direction</td><td>WHERE</td></tr><tr><td>λ</td><td>Eigenvalue / PCA variance amount</td><td>HOW MUCH</td></tr></tbody></table></div>
          <div class="callout teal"><strong>Read this aloud:</strong> x⁽⁴⁾ ∈ ℝ³⁰ = “fourth observation has 30 feature values.” <strong>Not:</strong> “there are 30 observations.”</div>
          <div class="pca-foundation-memory">Final memory: row = observation &nbsp; | &nbsp; input column = feature.</div>
        </section>
      </div>
    </article>

    <article class="panel" style="margin-top:15px"><h3>Step 1 — mean-center the data</h3><div class="pca-derivation-deep">
      <div class="pca-running-example"><div class="pca-step-kicker">RUNNING EXAMPLE</div><p>Isi 2-feature dataset ko centering se PC1 tak carry karenge. Rows observations hain.</p><div class="pca-derivation-math" data-derivation-math="running-x"></div><p><strong>n = 3</strong> observations aur <strong>p = 2</strong> features.</p></div>
      <section class="pca-derivation-step"><div class="pca-step-kicker">STEP A — GENERAL RULE</div><p>Har feature column ka mean nikalo, phir wahi feature-wise mean vector every row se subtract karo.</p><div class="pca-derivation-math" data-derivation-math="center-general"></div><div class="pca-old-concept"><strong>Old concept connection:</strong> μ ek feature-wise mean vector hai—p features ke liye p mean values.</div></section>
      <section class="pca-derivation-step"><div class="pca-step-kicker">STEP B — NUMERIC MEAN</div><div class="table-wrap"><table><thead><tr><th>Feature</th><th>Values</th><th>Mean</th></tr></thead><tbody><tr><td>Feature 1</td><td>1, 2, 3</td><td>(1+2+3)/3 = 2</td></tr><tr><td>Feature 2</td><td>1, 2, 3</td><td>(1+2+3)/3 = 2</td></tr></tbody></table></div><div class="pca-derivation-math" data-derivation-math="center-mean"></div></section>
      <section class="pca-derivation-step"><div class="pca-step-kicker">STEP C — EVERY ROW CENTER KARO</div><p>Same μ ko each observation se subtract karte hain.</p><div class="pca-derivation-math" data-derivation-math="center-rows"></div><div class="pca-derivation-math" data-derivation-math="centered-x"></div></section>
      <section class="pca-derivation-step"><div class="pca-step-kicker">STEP D — ZERO MEAN VERIFY KARO</div><div class="pca-derivation-math" data-derivation-math="center-check"></div><div class="pca-what"><strong>What happened?</strong><br>Har feature ka center 0 par shift hua.</div><div class="pca-result-match">Centering ka matlab sirf poore cloud ko origin ke around shift karna hai; relative spread/direction change nahi hoti.</div></section>
      <section class="pca-derivation-step"><div class="pca-step-kicker">CENTER VS STANDARDIZE</div><div class="pca-derivation-two"><div><strong>Centering</strong><div class="pca-derivation-math" data-derivation-math="center-only"></div><p>Mean zero karta hai; original units rehti hain.</p></div><div><strong>Standardization</strong><div class="pca-derivation-math" data-derivation-math="standardize"></div><p>Mean zero ke saath scale standard deviation units me laata hai.</p></div></div><div class="pca-running-example"><strong>Tiny scale example:</strong> Age roughly 20–60 hai, Salary roughly 30,000–150,000. Salary ka numeric scale much larger hone se uski variance PCA ko dominate kar sakti hai.</div><div class="callout gold"><strong>Correct rule:</strong> Features ke scales/units substantially different hon to standardization useful hoti hai. Sirf “values large hain” dekhkar automatically standardize nahi karte.</div></section>
    </div></article>

    <article class="panel" style="margin-top:15px"><h3>Step 2 — covariance matrix find karo</h3><div class="pca-derivation-deep">
      <section class="pca-derivation-step"><div class="pca-step-kicker">STEP A — CONVENTION CLEAR KARO</div><p>Row-observation convention me covariance centered matrix se banti hai. Denominator ke two common conventions hain:</p><div class="pca-derivation-math" data-derivation-math="cov-conventions"></div><div class="callout gold"><strong>Is running hand derivation me:</strong> population convention <strong>1/n</strong> use karenge. Isliye n = 3 se divide hoga. NumPy <code>np.cov</code> aur sklearn PCA explained variance commonly sample convention <strong>1/(n−1)</strong> use karte hain—dono ko silently mix mat karo.</div></section>
      <section class="pca-derivation-step"><div class="pca-step-kicker">STEP B — TRANSPOSE + MATRIX SHAPES</div><div class="pca-derivation-math" data-derivation-math="xc-transpose"></div><div class="pca-derivation-math" data-derivation-math="cov-shapes"></div><p><strong>Why multiplication works:</strong> (2×3)(3×2) me inner 3 matches, isliye multiplication possible hai. Outer dimensions 2×2 result ki shape banti hain.</p><div class="pca-result-match">p = 2 features → covariance matrix C is 2 × 2.</div></section>
      <section class="pca-derivation-step"><div class="pca-step-kicker">STEP C — MULTIPLY VISIBLY</div><div class="pca-derivation-math" data-derivation-math="cov-product"></div><div class="pca-derivation-two"><div><strong>Top-left</strong><br>(−1)(−1)+0(0)+1(1)=2</div><div><strong>Top-right</strong><br>(−1)(−1)+0(0)+1(1)=2</div><div><strong>Bottom-left</strong><br>(−1)(−1)+0(0)+1(1)=2</div><div><strong>Bottom-right</strong><br>(−1)(−1)+0(0)+1(1)=2</div></div><div class="pca-derivation-math" data-derivation-math="cov-product-result"></div></section>
      <section class="pca-derivation-step"><div class="pca-step-kicker">STEP D — n = 3 SE DIVIDE KARO</div><div class="pca-derivation-math" data-derivation-math="cov-numeric"></div><div class="pca-derivation-math" data-derivation-math="cov-structure"></div><div class="table-wrap"><table><thead><tr><th>Entry</th><th>Verified value</th></tr></thead><tbody><tr><td>Var(F1)</td><td>2/3</td></tr><tr><td>Var(F2)</td><td>2/3</td></tr><tr><td>Cov(F1,F2)</td><td>2/3</td></tr><tr><td>Cov(F2,F1)</td><td>2/3</td></tr></tbody></table></div><div class="pca-old-concept"><strong>Old concept connection:</strong> Cᵀ = C, kyunki covariance matrix symmetric hoti hai. Diagonal = feature variances; off-diagonal = feature relationships.</div><div class="pca-what"><strong>What happened?</strong><br>Humne poore data cloud ka spread + feature relationship ek 2×2 matrix me summarize kar diya.</div></section>
    </div></article>

    <div class="chapter-part">Part C — PCA derivation</div>
    <article class="panel"><h3>Step 3 — candidate direction u par project karo</h3><div class="pca-derivation-deep">
      <section class="pca-derivation-step"><div class="pca-step-kicker">STEP A — SCALAR VS VECTOR PROJECTION</div><div class="pca-derivation-math" data-derivation-math="projection-general"></div><div class="pca-derivation-two"><div><strong>uᵀx = HOW FAR</strong><br>Chosen axis par scalar coordinate.</div><div><strong>u = WHICH DIRECTION</strong><br>Unit vector that defines the axis.</div></div><div class="pca-old-concept"><strong>Old concept connection:</strong> uᵀx scalar projection hai; (uᵀx)u actual vector projection hai; uᵀu = 1 unit-vector condition hai.</div></section>
      <section class="pca-derivation-step"><div class="pca-step-kicker">STEP B — EASY X-AXIS DIRECTION</div><p>First candidate u = [1,0]ᵀ lo. Ye X-axis direction hai aur already unit vector hai.</p><div class="pca-derivation-math" data-derivation-math="projection-x-axis"></div><p><strong>z₃ = 1</strong> sirf u-axis par 1D coordinate hai. Original 2D feature space me actual projected point [1,0]ᵀ hai.</p></section>
      <section class="pca-derivation-step"><div class="pca-step-kicker">STEP C — DATA KI NATURAL DIAGONAL</div><p>Centered points (−1,−1), (0,0), (1,1) diagonal line par hain. Direction [1,1]ᵀ ki length √2 hai, so pehle normalize karna padega.</p><div class="pca-derivation-math" data-derivation-math="diagonal-normalize"></div><div class="pca-old-concept"><strong>Why unit vector?</strong> Agar length fixed na ho to same direction ko u, 2u, 100u bana kar projection scores artificially large kar sakte hain.</div></section>
      <section class="pca-derivation-step"><div class="pca-step-kicker">STEP D — ALL POINTS PROJECT KARO</div><div class="pca-derivation-math" data-derivation-math="project-all"></div><div class="pca-derivation-math" data-derivation-math="projected-z"></div><div class="pca-what"><strong>What happened?</strong><br>Har 2D observation ko chosen diagonal line par one scalar coordinate me convert kiya.</div></section>
    </div></article>

    <article class="panel" style="margin-top:15px"><h3>Projected variance formula kaise banta hai?</h3><div class="pca-derivation-deep">
      <section class="pca-derivation-step"><div class="pca-step-kicker">STEP A — PEHLE ORDINARY NUMERIC VARIANCE</div><p>Projected 1D points hain:</p><div class="pca-derivation-math" data-derivation-math="projected-z"></div><div class="pca-derivation-math" data-derivation-math="manual-z-variance"></div><div class="pca-result-match">Humne every point manually project karke ordinary variance calculate ki: <strong>4/3</strong>.</div><div class="pca-what"><strong>What happened?</strong><br>Ab projected 1D points kitne spread hain, wo measure kiya.</div></section>
      <section class="pca-derivation-step"><div class="pca-step-kicker">STEP B — GENERAL PROJECTION FORMULA</div><div class="pca-derivation-math" data-derivation-math="variance-general-start"></div><p>zᵢ−z̄ ko projection notation me substitute karne par:</p><div class="pca-derivation-math" data-derivation-math="variance-substitute"></div><p>Yahan aᵢ = x⁽ⁱ⁾−x̄ ek centered observation hai. Ab square ko matrix product me rewrite karna hai.</p></section>
      <section class="pca-derivation-step"><div class="pca-step-kicker">STEP C — SCALAR SQUARE KA MATRIX FORM</div><p>uᵀa ek scalar hai, aur scalar ka transpose same scalar hota hai.</p><div class="pca-derivation-math" data-derivation-math="scalar-square"></div><p>Ab a = x⁽ⁱ⁾−x̄ substitute karo:</p><div class="pca-derivation-math" data-derivation-math="square-observation"></div></section>
      <section class="pca-derivation-step"><div class="pca-step-kicker">STEP D — SUMMATION KE BAHAR uᵀ AUR u</div><div class="pca-derivation-math" data-derivation-math="variance-covariance"></div><p>Bracket wali matrix exactly population covariance matrix C hai.</p><div class="pca-derivation-math" data-derivation-math="variance-compact"></div></section>
      <section class="pca-derivation-step"><div class="pca-step-kicker">STEP E — SAME DATA SE uᵀCu VERIFY KARO</div><p>Running example ka C aur diagonal unit direction u use karte hain:</p><div class="pca-derivation-math" data-derivation-math="cu-numeric"></div><div class="pca-derivation-math" data-derivation-math="utcu-numeric"></div><div class="pca-result-match"><strong>Manual projected variance = 4/3</strong><span class="match-arrow">↔</span><strong>Matrix formula uᵀCu = 4/3</strong></div><div class="callout teal"><strong>Core insight:</strong> uᵀCu koi magic formula nahi hai. Ye wahi variance hai jo humne projected scores [−√2, 0, √2] se manually calculate ki thi.</div><div class="pca-what"><strong>What happened?</strong><br>Same projected variance ko compact covariance-matrix form me likh diya.</div></section>
      <section class="pca-derivation-step"><div class="pca-step-kicker">PCA KA OPTIMIZATION QUESTION</div><div class="pca-derivation-math" data-derivation-math="maximize-variance"></div><p>PCA aisi unit direction dhoondta hai jahan uᵀCu—yaani projected variance—maximum ho.</p></section>
    </div></article>

    <article class="panel" style="margin-top:15px"><h3>Why eigenvector? Lagrange bridge</h3><div class="pca-derivation-deep">
      <section class="pca-derivation-step"><div class="pca-step-kicker">STEP A — RUNNING C KE EIGENVALUES CALCULATE KARO</div><p>Special directions find karne ke liye characteristic equation solve karte hain.</p><div class="pca-derivation-math" data-derivation-math="eigenvalues-det"></div><div class="pca-derivation-math" data-derivation-math="eigenvalues-result"></div></section>
      <section class="pca-derivation-step"><div class="pca-step-kicker">STEP B — DONO EIGENVECTORS</div><div class="pca-derivation-two"><div><strong>For λ₁ = 4/3</strong><div class="pca-derivation-math" data-derivation-math="eigenvector-one"></div><p>v₂ = v₁, so choose [1,1]ᵀ and normalize.</p></div><div><strong>For λ₂ = 0</strong><div class="pca-derivation-math" data-derivation-math="eigenvector-two"></div><p>v₂ = −v₁, so choose [1,−1]ᵀ and normalize.</p></div></div><div class="pca-old-concept"><strong>Old concept connection:</strong> u₁ᵀu₂ = 0, so both directions orthogonal/perpendicular hain.</div></section>
      <section class="pca-derivation-step"><div class="pca-step-kicker">STEP C — EIGENVALUE AUR VARIANCE SAME NUMBER</div><div class="pca-result-match">Variance along u₁ = 4/3<span class="match-arrow">↔</span>Eigenvalue λ₁ = 4/3</div><p>Ye coincidence nahi hai. Unit covariance eigenvector ke liye proof:</p><div class="pca-derivation-math" data-derivation-math="eigenvalue-variance-proof"></div><div class="callout gold"><strong>Important correction:</strong> General matrix ka eigenvalue = stretch factor. Covariance matrix C + unit eigenvector v ke case me wahi eigenvalue us direction ka projected variance bhi hota hai.</div></section>
      <section class="pca-derivation-step"><div class="pca-step-kicker">STEP D — LAGRANGE INTUITION</div><p>PCA ko maximum uᵀCu chahiye, but u ki length fixed 1 rehni chahiye. Constraint ke bina u, 2u, 100u use karke score artificially badhaya ja sakta hai.</p><div class="pca-derivation-math" data-derivation-math="lagrange-objective"></div><p>λ yahan initially <strong>Lagrange multiplier</strong> hai, jo unit-length constraint enforce karta hai.</p><div class="pca-derivation-math" data-derivation-math="lagrange-steps"></div><div class="pca-result-match">Interesting result: optimization condition itself eigenvector equation ban gaya.</div><div class="pca-what"><strong>What happened?</strong><br>Maximum-variance search automatically covariance matrix ke eigenvector problem me convert ho gayi.</div></section>
      <section class="pca-derivation-step"><div class="pca-step-kicker">STEP E — WHY LARGEST EIGENVALUE = PC1</div><div class="table-wrap"><table><thead><tr><th>Direction</th><th>Projected variance / eigenvalue</th><th>PCA role</th></tr></thead><tbody><tr><td>u₁ = [1/√2, 1/√2]ᵀ</td><td>λ₁ = 4/3</td><td>Maximum → PC1</td></tr><tr><td>u₂ = [1/√2, −1/√2]ᵀ</td><td>λ₂ = 0</td><td>Remaining → PC2</td></tr></tbody></table></div><div class="pca-derivation-math" data-derivation-math="pc-final"></div><div class="callout teal"><strong>Do not confuse:</strong> PC1 eigenvector/direction hai—not 4/3. PC1 = [1/√2,1/√2]ᵀ; us direction ki variance/eigenvalue λ₁ = 4/3 hai.</div></section>
    </div></article>

    <article class="panel" style="margin-top:15px"><h3>PC2, PC3… aur orthogonality</h3><p>PC1 maximum variance direction hai. PC2 next-highest variance direction hai, but PC1 ke perpendicular; isi tarah remaining PCs.</p><div class="formula">C=Cᵀ<br>Cvᵢ=λᵢvᵢ, Cvⱼ=λⱼvⱼ<br><br>vᵢᵀCvⱼ = λⱼvᵢᵀvⱼ<br>(Cvᵢ)ᵀvⱼ = λᵢvᵢᵀvⱼ<br><br>(λᵢ−λⱼ)vᵢᵀvⱼ=0</div><p>Distinct eigenvalues par <code>vᵢᵀvⱼ=0</code>. Repeated eigenvalue case me orthonormal basis choose hoti hai. So PCA components mutually orthogonal store kiye jate hain.</p></article>

    <article class="panel" style="margin-top:15px"><h3>Complete manual example — 2D to 1D</h3><div class="formula">X = [[2,0], [0,2], [3,1], [1,3]]<br>μ = [1.5, 1.5]<br><br>Xc = [[ 0.5,−1.5], [−1.5, 0.5], [1.5,−0.5], [−0.5,1.5]]</div><div class="formula">C = XcᵀXc/3 = [[1.667,−1], [−1,1.667]]<br><br>Eigenvalues: λ₁≈2.667, λ₂≈0.667<br>PC1 may be u₁=[1,−1]/√2<br>PC2 may be u₂=[1, 1]/√2</div><p>PC1 scores: <code>Z=Xc·u₁ ≈ [1.414, −1.414, 1.414, −1.414]</code>. Explained variance ratio: <code>2.667/(2.667+0.667)=0.80</code>, so one component retains 80% variance.</p><div class="callout gold"><strong>Eigenvector sign:</strong> Software PC1 ko <code>[−1,1]/√2</code> bhi de sakta hai. Scores ke signs flip honge, geometry/information same rahegi.</div></article>

    <article class="panel" style="margin-top:15px"><h3>Dimension reduction, EVR and reconstruction</h3><div class="formula">Wₖ=[v₁ v₂ … vₖ] &nbsp; shape p×k<br>Z=XcWₖ &nbsp; shape n×k<br>X̂=ZWₖᵀ+μ &nbsp; approximate reconstruction</div><div class="formula">EVRᵢ = λᵢ / Σⱼλⱼ<br>Total variance = trace(C) = Σⱼλⱼ<br>Discarded variance = Σ of dropped eigenvalues</div><p><code>k=p</code> ho to reconstruction near-exact. <code>k&lt;p</code> ho to dropped PC directions ki information lose hoti hai.</p></article>

    <div class="chapter-part">Revision bridge — questions se pehle</div>
    <article class="panel pca-final-summary">
      <h3>FINAL CONCEPT SUMMARY — PCA BEFORE QUESTIONS</h3>
      <p class="pca-summary-intro">Yahan koi new concept nahi hai. Ye complete PCA story, notation aur formulas ko ek revision flow me connect karta hai.</p>

      <section class="pca-summary-card">
        <h4>1. Complete PCA story</h4>
        <div class="pca-summary-flow">
          <div><strong>Original data</strong>X: n × p</div>
          <div><strong>Mean-center</strong>Xc = X − μ</div>
          <div><strong>Covariance</strong>C: p × p</div>
          <div><strong>Eigen decomposition</strong>Ceᵢ = λᵢeᵢ</div>
          <div><strong>Sort</strong>λ₁ ≥ λ₂ ≥ … ≥ λₚ</div>
          <div><strong>PC directions</strong>PCᵢ = eᵢ</div>
          <div><strong>Keep top k</strong>Uₖ = [e₁ … eₖ]</div>
          <div><strong>Transform</strong>Z = XcUₖ: n × k</div>
        </div>
        <div class="pca-summary-math" data-summary-math="single-vs-matrix-projection"></div>
        <div class="pca-summary-end">Final result: n observations remain, but feature dimensions p se k ho jati hain.</div>
      </section>

      <section class="pca-summary-card">
        <h4>2. Har object ka meaning</h4>
        <div class="table-wrap"><table><thead><tr><th>Object</th><th>Meaning</th></tr></thead><tbody>
          <tr><td>n</td><td>Number of observations / rows.</td></tr><tr><td>p</td><td>Number of original input features / dimensions.</td></tr>
          <tr><td>X</td><td>Complete original dataset.</td></tr><tr><td>x⁽ⁱ⁾</td><td>i-th observation.</td></tr>
          <tr><td>μ</td><td>Feature-wise mean vector.</td></tr><tr><td>Xc</td><td>Mean-centered dataset.</td></tr>
          <tr><td>C</td><td>Covariance matrix.</td></tr><tr><td>u</td><td>One candidate unit direction.</td></tr>
          <tr><td>eᵢ</td><td>i-th eigenvector / principal direction.</td></tr><tr><td>λᵢ</td><td>Variance along corresponding unit PC direction.</td></tr>
          <tr><td>PCᵢ</td><td>Principal-component direction = eigenvector eᵢ.</td></tr><tr><td>zᵢ</td><td>One observation's projected coordinate.</td></tr>
          <tr><td>Z</td><td>All observations ke transformed PCA coordinates.</td></tr><tr><td>Uₖ</td><td>Top k principal directions ko columns me collect karne wali matrix.</td></tr>
        </tbody></table></div>
      </section>

      <section class="pca-summary-card">
        <h4>3. Most important distinctions</h4>
        <div class="pca-summary-memory-grid">
          <div class="pca-summary-memory"><strong>PC1 ≠ λ₁</strong><br>PC1 = eigenvector/direction.<br>λ₁ = PC1 direction ke along variance.</div>
          <div class="pca-summary-memory"><strong>PC1 ≠ PC1 column</strong><br>PC1 = direction/recipe. One PC1 score = one row ka projection. PC1 column = all rows ke scores.</div>
          <div class="pca-summary-memory"><strong>Scalar ≠ projected vector</strong><br>uᵀx = one scalar coordinate.<br>(uᵀx)u = original feature space ka projected vector.</div>
          <div class="pca-summary-memory"><strong>u ≠ U</strong><br>u = one PC direction.<br>U = multiple PC directions ki matrix.</div>
          <div class="pca-summary-memory"><strong>Uncorrelated ≠ independent</strong><br>PCA PCs ko orthogonal aur uncorrelated banata hai; general independence guarantee nahi karta.</div>
        </div>
      </section>

      <section class="pca-summary-card">
        <h4>4. Dimensionality intuition — p = 4</h4>
        <p>Four original features → C is 4×4 → up to four eigenvalues, four eigenvectors and four PCs.</p>
        <div class="pca-summary-dimensions"><div><strong>4D → 4D</strong>Keep PC1–PC4<br>No reduction</div><div><strong>4D → 3D</strong>Keep PC1–PC3</div><div><strong>4D → 2D</strong>Keep PC1 + PC2</div><div><strong>4D → 1D</strong>Keep PC1</div></div>
        <div class="callout teal"><strong>Rows do not disappear.</strong> Sirf feature dimensions ki count change hoti hai.</div>
      </section>

      <section class="pca-summary-card">
        <h4>5. Why PC1?</h4>
        <div class="pca-summary-math" data-summary-math="why-pc1"></div>
        <div class="pca-summary-two"><div><strong>Eigenvector = WHERE</strong><br>Maximum-spread direction kahan hai.</div><div><strong>Eigenvalue = HOW MUCH</strong><br>Us unit direction par variance kitni hai.</div></div>
      </section>

      <section class="pca-summary-card">
        <h4>6. Explained variance</h4>
        <div class="pca-summary-math" data-summary-math="evr-summary"></div>
        <div class="table-wrap"><table><thead><tr><th>Keep</th><th>Retained variance</th><th>Decision</th></tr></thead><tbody><tr><td>PC1</td><td>12/20 = 60%</td><td>Only 60%</td></tr><tr><td>PC1 + PC2</td><td>17/20 = 85%</td><td>Below 90%</td></tr><tr><td>PC1 + PC2 + PC3</td><td>19/20 = 95%</td><td>At least 90% achieved</td></tr></tbody></table></div>
        <div class="callout gold"><strong>Discarded variance ≠ deleted rows.</strong> Dropped PC directions me present spread/information remove hoti hai.</div>
      </section>

      <section class="pca-summary-card">
        <h4>7. Orthogonality</h4>
        <div class="pca-summary-math" data-summary-math="orthogonality-summary"></div>
        <p>Different unit PCs perpendicular (90°) hote hain. PC basis me covariance matrix diagonal hone ka matlab different PC-score columns ki covariance zero hai.</p>
      </section>

      <section class="pca-summary-card">
        <h4>8. Centering vs standardization</h4>
        <div class="pca-summary-two"><div><strong>Centering</strong><div class="pca-summary-math" data-summary-math="summary-center"></div><p>Data cloud ko origin par shift karta hai. PCA ka fundamental step.</p></div><div><strong>Standardization</strong><div class="pca-summary-math" data-summary-math="summary-standardize"></div><p>Units/scales significantly different hon to features comparable banata hai; universally mandatory nahi.</p></div></div>
      </section>

      <section class="pca-summary-card">
        <h4>9. Reconstruction</h4>
        <div class="pca-summary-math" data-summary-math="reconstruction-summary"></div>
        <div class="pca-summary-two"><div><strong>All PCs retained</strong><br>Exact reconstruction (numerical rounding aside).</div><div><strong>Some PCs discarded</strong><br>Approximate reconstruction; dropped directions ki information lost.</div></div>
      </section>

      <section class="pca-summary-card">
        <h4>10. GATE notation quick decoder</h4>
        <div class="table-wrap"><table><thead><tr><th>Notation</th><th>Immediately read it as</th></tr></thead><tbody>
          <tr><td>x⁽ⁱ⁾ ∈ ℝᵖ</td><td>i-th observation has p features.</td></tr><tr><td>X ∈ ℝⁿˣᵖ</td><td>n observations × p features.</td></tr>
          <tr><td>Σᵢx⁽ⁱ⁾ = 0</td><td>Dataset centered / mean zero.</td></tr><tr><td>uᵀu = 1</td><td>u is a unit vector.</td></tr>
          <tr><td>uᵀx⁽ⁱ⁾</td><td>i-th observation ka scalar projection.</td></tr><tr><td>Ceᵢ = λᵢeᵢ</td><td>Covariance matrix ka eigenpair.</td></tr>
          <tr><td>Maximum variance direction</td><td>Largest eigenvalue ka eigenvector.</td></tr><tr><td>Different PCs</td><td>Orthogonal / 90°.</td></tr>
        </tbody></table></div>
      </section>

      <section class="pca-summary-card">
        <h4>11. Formula map</h4>
        <div class="table-wrap"><table class="pca-formula-table"><thead><tr><th>Purpose</th><th>Formula</th></tr></thead><tbody>
          <tr><td>Mean</td><td><code>μ=(1/n)Σᵢx⁽ⁱ⁾</code></td></tr><tr><td>Center</td><td><code>x_c=x−μ</code></td></tr>
          <tr><td>Covariance</td><td><code>C=(1/n)Σᵢx_c⁽ⁱ⁾(x_c⁽ⁱ⁾)ᵀ</code></td></tr><tr><td>Projection</td><td><code>z=uᵀx_c</code></td></tr>
          <tr><td>Projected vector</td><td><code>x_proj=(uᵀx_c)u</code></td></tr><tr><td>Projected variance</td><td><code>Var(z)=uᵀCu</code></td></tr>
          <tr><td>Eigen equation</td><td><code>Cu=λu</code></td></tr><tr><td>Unit eigenvector</td><td><code>Var(z)=λ</code></td></tr>
          <tr><td>EVR</td><td><code>EVRᵢ=λᵢ/Σⱼλⱼ</code></td></tr><tr><td>Total variance</td><td><code>trace(C)=Σᵢλᵢ</code></td></tr>
          <tr><td>Multiple-PC projection</td><td><code>z=Uₖᵀx_c</code></td></tr><tr><td>Reconstruction</td><td><code>x̂=μ+Uₖz</code></td></tr>
        </tbody></table></div>
      </section>

      <section class="pca-summary-card">
        <h4>12. 10-second GATE checklist</h4>
        <ol class="pca-summary-checklist"><li>n = observations; p = features.</li><li>x⁽ⁱ⁾ = i-th observation.</li><li>Centered data? Mean = 0.</li><li>Eigenvalues given? Descending sort karo.</li><li>Largest λ ka eigenvector = PC1.</li><li>λ = corresponding unit PC ki variance.</li><li>k dimensions? Top k PCs keep karo.</li><li>Retained variance = selected λ sum / total λ sum.</li><li>Different PCs = orthogonal = 90°.</li><li>uᵀx = scalar coordinate.</li><li>PC1 direction hai; PC1 column scores hain.</li><li>Rows PCA me disappear nahi hoti.</li></ol>
      </section>

      <section class="pca-summary-card pca-summary-example">
        <h4>13. One complete 4D example</h4>
        <p>Original data: <strong>n observations × 4 features</strong> (F1, F2, F3, F4). Suppose sorted eigenvalues are 12, 5, 2, 1 and corresponding eigenvectors are e₁, e₂, e₃, e₄.</p>
        <div class="table-wrap"><table><thead><tr><th>PC</th><th>Direction</th><th>Variance</th></tr></thead><tbody><tr><td>PC1</td><td>e₁</td><td>12</td></tr><tr><td>PC2</td><td>e₂</td><td>5</td></tr><tr><td>PC3</td><td>e₃</td><td>2</td></tr><tr><td>PC4</td><td>e₄</td><td>1</td></tr></tbody></table></div>
        <div class="pca-summary-two"><div><strong>4D → 1D</strong><br>Keep PC1.</div><div><strong>4D → 2D</strong><br>Keep PC1 + PC2.</div></div>
        <div class="pca-summary-end">At least 90% chahiye: PC1+PC2 = 85% insufficient; PC1+PC2+PC3 = 95%, therefore k = 3.</div>
      </section>
    </article>

    <div class="chapter-part">All PCA GATE questions + final revision</div>
    ${gate2025Card}
    ${gate2026Card}
  `);
}

const gate2024Projection = pyqCard({
  year: 2024, questionNumber: 49, supporting: true,
  topic: 'Projection matrix; rank/nullity; idempotence',
  source: `${sourceLink(officialSources.gate2024, 'official question paper')} · ${sourceLink(officialSources.gate2024Key, 'official answer key')}`,
  question: `<p><code>U</code> is a subspace of <code>ℝ³</code> and <code>M∈ℝ³ˣ³</code> is the matrix for projection onto U. Which statements are true?</p><p>A If dim(U)=1, null(M) has dimension 1 · B If dim(U)=2, null(M) has dimension 1 · C <code>M²=M</code> · D <code>M³=M</code>.</p>`,
  decoder: `<div class="notation-grid"><div><code>U</code>Target subspace.</div><div><code>M</code>Vector ko U par project karne wali linear map.</div><div><code>null(M)</code>Projection ke baad zero hone wali perpendicular directions.</div><div><code>M²=M</code>Same projection twice changes nothing: idempotence.</div></div>`,
  solution: `<ol><li>Projection onto U has <code>rank(M)=dim(U)</code>.</li><li>Rank-nullity in ℝ³: <code>nullity=3−rank</code>. dim(U)=1 ⇒ nullity 2, so A false. dim(U)=2 ⇒ nullity 1, so B true.</li><li>Once projected, projecting again leaves the vector unchanged: <code>M²=M</code>, so C true.</li><li><code>M³=M²M=MM=M²=M</code>, so D true.</li></ol><p>PCA reconstruction projection matrix is <code>WₖWₖᵀ</code>; orthonormal Wₖ makes it idempotent.</p>`,
  recognition: 'Projection matrix ⇒ idempotent. Nullity = ambient dimension − projected-subspace dimension.',
  trap: 'Nullity ko subspace dimension ke equal assume karna.', answer: '<strong>B, C and D</strong>.'
});

const gate2026Centering = pyqCard({
  year: 2026, questionNumber: 52, supporting: true,
  topic: 'Centering matrix as projection; symmetry; trace',
  source: `${sourceLink(officialSources.gate2026, 'official question paper')} · ${sourceLink(officialSources.gate2026Key, 'official answer key')}`,
  question: `<p><code>M = Iₙ − (1/n)11ᵀ</code>, where <code>1=(1,…,1)ᵀ</code>. Which are correct?</p><p>A <code>Mᵀ=M</code> · B <code>M²=Iₙ</code> · C <code>trace(M)=n</code> · D M is a projection matrix.</p>`,
  decoder: `<div class="notation-grid"><div><code>11ᵀ</code>All-ones n×n matrix.</div><div><code>Iₙ</code>n×n identity.</div><div><code>M</code>Mean-centering operator.</div><div><code>trace(M)</code>Diagonal sum; also eigenvalue sum.</div></div>`,
  solution: `<ol><li>Both <code>Iₙ</code> and <code>11ᵀ</code> are symmetric ⇒ A true.</li><li>Since <code>1ᵀ1=n</code>, expansion gives <code>M²=M</code>, not <code>Iₙ</code> ⇒ B false.</li><li><code>trace(M)=n−(1/n)trace(11ᵀ)=n−1</code> ⇒ C false.</li><li><code>M²=M</code> and M projects vectors onto the zero-mean subspace orthogonal to 1 ⇒ D true.</li></ol><p>This is exactly matrix-form mean-centering used before PCA.</p>`,
  recognition: '<code>I−11ᵀ/n</code> dikhe ⇒ centering matrix; symmetric + idempotent projection.', trap: 'Idempotent <code>M²=M</code> ko involutory <code>M²=I</code> se confuse karna.', answer: '<strong>A and D</strong>.'
});

const gate2026Trace = pyqCard({
  year: 2026, questionNumber: 46, supporting: true,
  topic: 'Trace / sum of eigenvalues identity',
  source: `${sourceLink(officialSources.gate2026, 'official question paper')} · ${sourceLink(officialSources.gate2026Key, 'official answer key')}`,
  question: `<p>Let the eigenvalues of <code>A = [[1,0,0],[0,cos t,sin t],[0,−sin t,cos t]]</code> be <code>γ₁,γ₂,γ₃</code>, where <code>t∈[−π,π]</code>. Find all t satisfying <code>γ₁+γ₂+γ₃=1+√2</code>.</p><p>A {π/3,−π/4} · B {π/4,−π/3} · C {π/4,−π/4} · D {π/3,−π/3}</p>`,
  decoder: `<div class="notation-grid"><div><code>γ₁+γ₂+γ₃</code>All eigenvalues ka sum.</div><div><code>trace(A)</code>Diagonal entries ka sum; always eigenvalue sum ke equal.</div><div><code>2×2 block</code>Plane rotation block with diagonal entries cos t, cos t.</div></div>`,
  solution: `<ol><li>Eigenvalues individually find karna unnecessary: <code>Σγᵢ=trace(A)</code>.</li><li><code>trace(A)=1+cos t+cos t=1+2cos t</code>.</li><li><code>1+2cos t=1+√2 ⇒ cos t=√2/2</code>.</li><li>Within <code>[−π,π]</code>, <code>t=π/4</code> or <code>−π/4</code>.</li></ol><p>PCA connection: covariance matrix ka <code>trace(C)=Σλᵢ</code> total variance hota hai; EVR denominator isi sum ko use karta hai.</p>`,
  recognition: 'Eigenvalues ka sum poocha ho ⇒ pehle trace check karo; characteristic polynomial mat expand karo.', trap: 'Rotation block ke complex eigenvalues separately calculate karke time waste karna.', answer: '<strong>Option C: {π/4, −π/4}</strong>.'
});

const lecture49 = document.querySelector('#lecture-49');
if (lecture49) {
  lecture49.querySelector('.section-intro').textContent = 'PCA ko NumPy se manually implement karo, sklearn Pipeline me leakage-safe use karo, visualize, reconstruct aur evaluate karo.';
  lecture49.querySelectorAll(':scope > article, :scope > details, :scope > .chapter-part').forEach((node) => node.remove());
  lecture49.insertAdjacentHTML('beforeend', `
    <div class="chapter-part">Part G — Practical PCA</div>
    <article class="panel"><h3>PCA from scratch with NumPy</h3><div class="formula">import numpy as np<br><br>X = np.array([[2.,0.], [0.,2.], [3.,1.], [1.,3.]])<br>print(X.shape)                         # (n, p)<br><br>mu = X.mean(axis=0)                    # μ<br>Xc = X - mu                           # Xc = X − μ<br>C = np.cov(Xc, rowvar=False)          # C = XcᵀXc/(n−1)<br><br>eigenvalues, eigenvectors = np.linalg.eigh(C)  # Cv = λv<br>order = np.argsort(eigenvalues)[::-1]<br>eigenvalues = eigenvalues[order]<br>eigenvectors = eigenvectors[:, order]<br><br>k = 1<br>W = eigenvectors[:, :k]               # p × k<br>Z = Xc @ W                             # n × k<br><br>evr = eigenvalues / eigenvalues.sum()<br>X_reconstructed = Z @ W.T + mu         # X̂ = ZWᵀ + μ<br>reconstruction_mse = np.mean((X - X_reconstructed)**2)</div><div class="table-wrap"><table class="code-map"><thead><tr><th>Code</th><th>Mathematics / meaning</th></tr></thead><tbody><tr><td><code>X.mean(axis=0)</code></td><td>Feature mean vector μ.</td></tr><tr><td><code>X - mu</code></td><td><code>Xc=X−μ</code>, center every feature.</td></tr><tr><td><code>np.cov(...)</code></td><td>Covariance matrix C. <code>rowvar=False</code>: columns are features.</td></tr><tr><td><code>np.linalg.eigh(C)</code></td><td>Symmetric C ke eigenpairs: <code>Cv=λv</code>.</td></tr><tr><td><code>argsort(...)[::-1]</code></td><td>Largest variance directions first.</td></tr><tr><td><code>W=eigenvectors[:,:k]</code></td><td>Top k eigenvectors as mathematical columns.</td></tr><tr><td><code>Xc @ W</code></td><td>PC coordinates <code>Z=XcW</code>.</td></tr><tr><td><code>Z @ W.T + mu</code></td><td>Approximate inverse/reconstruction.</td></tr></tbody></table></div></article>

    <article class="panel" style="margin-top:15px"><h3>Matrix shapes — mathematical vs sklearn orientation</h3><div class="table-wrap"><table><thead><tr><th>Object</th><th>Shape</th><th>Meaning</th></tr></thead><tbody><tr><td><code>X_train</code></td><td>1000×20</td><td>1000 samples, 20 features.</td></tr><tr><td><code>W</code> math convention</td><td>20×5</td><td>Five PCs stored as columns.</td></tr><tr><td><code>Z=XW</code></td><td>1000×5</td><td>Five PC coordinates per sample.</td></tr><tr><td><code>pca.components_</code></td><td>5×20</td><td>sklearn stores one PC per row; this is <code>Wᵀ</code>.</td></tr></tbody></table></div><div class="formula">Math: Z = XcW<br>sklearn equivalent: Z = Xc @ pca.components_.T</div></article>

    <article class="panel" style="margin-top:15px"><h3>Leakage-safe sklearn PCA pipeline</h3><div class="formula">from sklearn.model_selection import train_test_split<br>from sklearn.pipeline import Pipeline<br>from sklearn.preprocessing import StandardScaler<br>from sklearn.decomposition import PCA<br>from sklearn.linear_model import LogisticRegression<br><br>X_train, X_test, y_train, y_test = train_test_split(<br>&nbsp;&nbsp;X, y, test_size=0.2, stratify=y, random_state=42<br>)<br><br>pipe = Pipeline([<br>&nbsp;&nbsp;('scaler', StandardScaler()),<br>&nbsp;&nbsp;('pca', PCA(n_components=0.95)),<br>&nbsp;&nbsp;('model', LogisticRegression(max_iter=2000))<br>])<br>pipe.fit(X_train, y_train)<br>score = pipe.score(X_test, y_test)</div><p>Pipeline train par scaler mean/std aur PCA components learn karta hai. Test par sirf learned transformation apply hoti hai.</p><div class="grid-2"><div class="callout teal"><strong>Correct manual flow</strong><br><code>scaler.fit_transform(X_train)</code><br><code>scaler.transform(X_test)</code><br><code>pca.fit_transform(train_scaled)</code><br><code>pca.transform(test_scaled)</code></div><div class="callout gold"><strong>Data leakage</strong><br>Test set par <code>fit</code> karna test distribution ki information training process me leak karta hai. Test par scaler/PCA separately fit kabhi mat karo.</div></div></article>

    <article class="panel" style="margin-top:15px"><h3>PCA object ka har attribute kya batata hai?</h3><div class="table-wrap"><table><thead><tr><th>Mathematics</th><th>NumPy / sklearn</th><th>Meaning</th></tr></thead><tbody><tr><td>μ</td><td><code>X.mean()</code> / <code>scaler.mean_</code></td><td>Feature means.</td></tr><tr><td>C</td><td><code>np.cov(...)</code></td><td>Covariance matrix.</td></tr><tr><td>vᵢ</td><td><code>pca.components_</code></td><td>Principal directions, one per row in sklearn.</td></tr><tr><td>λᵢ</td><td><code>pca.explained_variance_</code></td><td>Each retained PC ka variance.</td></tr><tr><td>λᵢ/Σλ</td><td><code>pca.explained_variance_ratio_</code></td><td>Total variance ka fraction.</td></tr><tr><td>k</td><td><code>pca.n_components_</code></td><td>Actually retained components.</td></tr><tr><td>Z</td><td><code>pca.transform(X)</code></td><td>PCA-space coordinates.</td></tr><tr><td>X̂</td><td><code>pca.inverse_transform(Z)</code></td><td>Approximation in pre-PCA feature space.</td></tr></tbody></table></div></article>

    <article class="panel" style="margin-top:15px"><h3>n_components kaise choose karein?</h3><div class="grid-2"><div><h4>Fixed dimensions</h4><div class="formula">PCA(n_components=2)</div><p>Visualization ya known output dimension ke liye exactly two PCs.</p></div><div><h4>Retain variance</h4><div class="formula">PCA(n_components=0.95)</div><p>Minimum k choose hota hai jahan cumulative EVR ≥ 95%.</p></div></div><div class="formula">pca_all = PCA().fit(X_train_scaled)<br>cumulative = np.cumsum(pca_all.explained_variance_ratio_)<br><br>plt.plot(range(1, len(cumulative)+1), cumulative, marker='o')<br>plt.axhline(0.95, color='red', linestyle='--')<br>plt.xlabel('Number of components')<br>plt.ylabel('Cumulative explained variance')</div><p>Scree plot individual eigenvalues dikhata hai; elbow ke baad extra PCs little variance add karte hain. Cumulative plot directly retained information target dikhata hai.</p></article>

    <article class="panel" style="margin-top:15px"><h3>Visualization — labels sirf color ke liye</h3><div class="formula">from sklearn.datasets import load_wine<br>from sklearn.preprocessing import StandardScaler<br>from sklearn.decomposition import PCA<br>import matplotlib.pyplot as plt<br><br>X, y = load_wine(return_X_y=True)      # X has 13 features<br>Xs = StandardScaler().fit_transform(X)<br>Z = PCA(n_components=2).fit_transform(Xs)<br><br>plt.scatter(Z[:,0], Z[:,1], c=y, cmap='viridis')<br>plt.xlabel('PC1'); plt.ylabel('PC2')</div><div class="callout teal"><strong>Unsupervised remains unsupervised:</strong> <code>y</code> PCA fit me pass nahi hua. Labels only dots ko color kar rahe hain so classes visually compare ho saken.</div></article>

    <article class="panel" style="margin-top:15px"><h3>Reconstruction = information loss ko visible banao</h3><div class="formula">Z = pca.fit_transform(X_train_scaled)<br>X_approx = pca.inverse_transform(Z)<br><br>print(X_train_scaled[0])<br>print(X_approx[0])<br>mse = np.mean((X_train_scaled - X_approx)**2)</div><p><code>k=d</code> par near-exact reconstruction; <code>k&lt;d</code> par approximate. Reconstruction error discarded PCs/eigenvalues ki lost variance reflect karta hai.</p></article>

    <article class="panel" style="margin-top:15px"><h3>When PCA helps—and when it can hurt</h3><div class="table-wrap"><table><thead><tr><th>Use PCA when</th><th>Be cautious when</th></tr></thead><tbody><tr><td>Many correlated numerical features.</td><td>Original feature interpretability essential ho.</td></tr><tr><td>Visualization in 2D/3D chahiye.</td><td>Categorical encodings ka Euclidean geometry meaningful na ho.</td></tr><tr><td>Dimensions/computation reduce karna ho.</td><td>Dataset already low-dimensional ho.</td></tr><tr><td>Redundancy/multicollinearity reduce karni ho.</td><td>Scaling choice inappropriate ho.</td></tr><tr><td>Compression and denoising useful ho.</td><td>Low-variance direction target y ke liye highly predictive ho.</td></tr></tbody></table></div><div class="callout gold"><strong>Critical limitation:</strong> PCA unsupervised hai. Maximum variance ≠ maximum predictive information about target y. Accuracy improve hogi, ye guarantee nahi.</div></article>

    <article class="panel" style="margin-top:15px"><h3>Mini project — Wine: before vs after PCA</h3><div class="formula">from sklearn.datasets import load_wine<br>from sklearn.model_selection import train_test_split<br>from sklearn.pipeline import make_pipeline<br>from sklearn.preprocessing import StandardScaler<br>from sklearn.decomposition import PCA<br>from sklearn.linear_model import LogisticRegression<br><br>X, y = load_wine(return_X_y=True)<br>Xtr, Xte, ytr, yte = train_test_split(<br>&nbsp;&nbsp;X, y, test_size=.25, stratify=y, random_state=42<br>)<br><br>baseline = make_pipeline(StandardScaler(), LogisticRegression(max_iter=2000))<br>reduced = make_pipeline(StandardScaler(), PCA(n_components=.95), LogisticRegression(max_iter=2000))<br><br>baseline.fit(Xtr, ytr); reduced.fit(Xtr, ytr)<br>print('original shape:', Xtr.shape)<br>print('baseline accuracy:', baseline.score(Xte, yte))<br>print('PCA accuracy:', reduced.score(Xte, yte))<br>print('retained k:', reduced.named_steps['pca'].n_components_)<br>print('retained variance:', reduced.named_steps['pca'].explained_variance_ratio_.sum())</div><ol><li>Dimensions kitni reduce hui?</li><li>At least 95% variance retain hui?</li><li>Accuracy similar, better, ya worse hui?</li><li>Training speed/interpretability trade-off kya raha?</li></ol><p>Conclusion dataset-specific likho; PCA ko automatic accuracy booster mat declare karo.</p></article>

    <div class="chapter-part">Part F/H — Actual GATE DA + final revision</div>
    ${gate2024Projection}
    ${gate2026Centering}
    ${gate2026Trace}

    <article class="panel" style="margin-top:15px"><h3>Complete PCA GATE PYQ revision</h3><div class="table-wrap"><table><thead><tr><th>Year / Q</th><th>Core concept</th><th>Difficulty</th><th>Key recognition</th><th>Answer</th></tr></thead><tbody><tr><td>2024 Q18</td><td>PCA purpose</td><td>Easy</td><td>Unsupervised dimensionality reduction</td><td>C</td></tr><tr><td>2024 Q49*</td><td>Projection matrix</td><td>Medium</td><td>Rank-nullity + idempotence</td><td>B,C,D</td></tr><tr><td>2025 Q60</td><td>Maximum projected variance</td><td>Medium/Hard</td><td>Centered + max direction ⇒ λmax</td><td>100</td></tr><tr><td>2026 Q11</td><td>Orthogonal PCs</td><td>Easy</td><td>Different PCs ⇒ 90°</td><td>B</td></tr><tr><td>2026 Q46*</td><td>Trace = sum eigenvalues</td><td>Easy/Medium</td><td>Use trace; avoid eigen decomposition</td><td>C</td></tr><tr><td>2026 Q52*</td><td>Centering projection</td><td>Medium</td><td><code>I−11ᵀ/n</code> ⇒ symmetric/idempotent</td><td>A,D</td></tr></tbody></table></div><p class="pca-source-note">*PCA-supporting linear algebra PYQ; official paper me PCA-specific wording nahi hai. Direct PCA PYQs ko theory ke baad complete format me solve kiya gaya hai.</p></article>

    <article class="panel" style="margin-top:15px"><h3>Formula sheet + two checklists</h3><div class="formula">Xc=X−μ<br>C=XcᵀXc/(n−1)<br>zᵢ=uᵀxᶜ⁽ⁱ⁾<br>Var(z)=uᵀCu<br>Cu=λu<br>EVRᵢ=λᵢ/Σλ<br>Z=XcWₖ<br>X̂=ZWₖᵀ+μ<br>trace(C)=Σλᵢ</div><div class="grid-2"><div><h4>GATE checklist</h4><ul class="pca-checklist"><li>n vs p decode</li><li>Centered means μ=0</li><li>Projection scalar vs vector</li><li>Maximum variance ⇒ λmax</li><li>Different PCs ⇒ orthogonal</li><li>Total variance ⇒ trace/sum λ</li><li>Read denominator convention</li></ul></div><div><h4>Practical checklist</h4><ul class="pca-checklist"><li>Split before fitting</li><li>Scale numeric features when needed</li><li>Fit scaler/PCA only on train</li><li>Check cumulative EVR</li><li>Inspect matrix orientation</li><li>Measure reconstruction loss</li><li>Compare model before/after</li></ul></div></div></article>
  `);
}

// Keep Lecture 49 practical-only: consolidate its GATE cards and revision
// material into Lecture 48's existing question section.
if (lecture48 && lecture49) {
  const gateRevisionDivider = [...lecture49.children].find(
    (node) => node.classList?.contains('chapter-part') && node.textContent.includes('Actual GATE DA')
  );
  if (gateRevisionDivider) {
    let node = gateRevisionDivider.nextElementSibling;
    gateRevisionDivider.remove();
    while (node) {
      const next = node.nextElementSibling;
      lecture48.append(node);
      node = next;
    }
  }
}

function makeMath(tex, level = 'display', label = '') {
  const wrapper = document.createElement('div');
  wrapper.className = `pca-math-display ${level}`.trim();
  wrapper.setAttribute('role', 'math');
  wrapper.setAttribute('aria-label', tex);
  katex.render(tex, wrapper, { displayMode: true, throwOnError: false, strict: false });
  if (!label) return wrapper;
  const group = document.createElement('div');
  group.append(wrapper);
  const caption = document.createElement('div');
  caption.className = 'pca-math-label';
  caption.textContent = label;
  group.append(caption);
  return group;
}

function replaceFormula(article, index, tex, level = 'display', label = '') {
  const formula = article?.querySelectorAll('.formula')[index];
  if (formula) formula.replaceWith(makeMath(tex, level, label));
}

function articleByTitle(root, title) {
  return [...(root?.querySelectorAll('article') || [])].find((article) => article.querySelector('h3')?.textContent.trim() === title);
}

function renderInlineMath(root, dictionary) {
  root?.querySelectorAll('code').forEach((code) => {
    const tex = dictionary[code.textContent.trim()];
    if (!tex) return;
    const span = document.createElement('span');
    span.className = 'pca-math-inline';
    span.setAttribute('role', 'math');
    span.setAttribute('aria-label', tex);
    katex.render(tex, span, { displayMode: false, throwOnError: false, strict: false });
    code.replaceWith(span);
  });
}

const foundationMath = {
  'dataset-matrix': [String.raw`\begin{gathered}X=\begin{bmatrix}20&170&60\\22&175&65\\21&168&58\\25&180&72\end{bmatrix}\\[12pt]X\in\mathbb{R}^{4\times3}\end{gathered}`, 'major'],
  'x-general-shape': [String.raw`\begin{aligned}\boxed{X\in\mathbb{R}^{n\times p}}\\[10pt]n&=\text{rows / observations}\\p&=\text{input feature columns}\end{aligned}`, 'major'],
  'row-four': [String.raw`\begin{gathered}x^{(4)}=\begin{bmatrix}25&180&72\end{bmatrix}\\[8pt]x^{(4)}\in\mathbb{R}^{3}\\[10pt]\text{General:}\quad x^{(i)}\in\mathbb{R}^{p}\end{gathered}`, 'major'],
  'real-space': [String.raw`\begin{aligned}\underbrace{\begin{bmatrix}25&180&72\end{bmatrix}}_{\text{3 real-number components}}&\in\mathbb{R}^{3}\\[10pt]\mathbb{R}^{p}&=\text{p-dimensional real-valued vector space}\end{aligned}`, 'display'],
  'x-specific-general': [String.raw`\begin{aligned}X&\in\mathbb{R}^{\overbrace{4}^{\text{observations}}\times\overbrace{3}^{\text{features}}}\\[10pt]\text{General form:}\qquad X&\in\mathbb{R}^{n\times p}\end{aligned}`, 'major'],
  'mean-vector': [String.raw`\begin{aligned}\mu&=\begin{bmatrix}\operatorname{mean}(Age)&\operatorname{mean}(Height)&\operatorname{mean}(Weight)\end{bmatrix}\\[10pt]&=\begin{bmatrix}22&173.25&63.75\end{bmatrix}\in\mathbb{R}^{3}\end{aligned}`, 'display'],
  'centering-row': [String.raw`\begin{aligned}x_c^{(4)}&=x^{(4)}-\mu\\[6pt]&=\begin{bmatrix}25-22&180-173.25&72-63.75\end{bmatrix}\\[6pt]&=\begin{bmatrix}3&6.75&8.25\end{bmatrix}\\[10pt]X_c&=X-\mu\quad\text{(same subtraction on every row)}\end{aligned}`, 'derivation'],
  'u-direction': [String.raw`u=\begin{bmatrix}u_1\\u_2\\u_3\end{bmatrix}\in\mathbb{R}^{3}\qquad\text{and in PCA}\qquad u^Tu=1`, 'major'],
  'projection-score': [String.raw`\begin{aligned}x^{(i)}&=\begin{bmatrix}3\\2\end{bmatrix},\qquad u=\begin{bmatrix}1\\0\end{bmatrix}\\[10pt]z_i&=u^Tx^{(i)}\\[5pt]&=\begin{bmatrix}1&0\end{bmatrix}\begin{bmatrix}3\\2\end{bmatrix}=\boxed{3}\end{aligned}`, 'major'],
  'covariance-three': [String.raw`C=\begin{bmatrix}\operatorname{Var}(F_1)&\operatorname{Cov}(F_1,F_2)&\operatorname{Cov}(F_1,F_3)\\\operatorname{Cov}(F_2,F_1)&\operatorname{Var}(F_2)&\operatorname{Cov}(F_2,F_3)\\\operatorname{Cov}(F_3,F_1)&\operatorname{Cov}(F_3,F_2)&\operatorname{Var}(F_3)\end{bmatrix}\in\mathbb{R}^{3\times3}`, 'display'],
  'eigen-relation': [String.raw`\begin{gathered}\boxed{Cv=\lambda v}\\[12pt]v=\text{WHERE: eigenvector direction}\\[6pt]\lambda=\text{HOW MUCH}\\[6pt]\text{For covariance }C\text{ and unit }v:\quad\lambda=\text{variance along }v\end{gathered}`, 'major']
};

lecture48?.querySelectorAll('.pca-foundation-math[data-math]').forEach((placeholder) => {
  const entry = foundationMath[placeholder.dataset.math];
  if (entry) placeholder.replaceWith(makeMath(entry[0], entry[1]));
});

const derivationMath = {
  'running-x': [String.raw`X=\begin{bmatrix}1&1\\2&2\\3&3\end{bmatrix}\in\mathbb{R}^{3\times2}`, 'major'],
  'center-general': [String.raw`\begin{aligned}\mu&=\frac{1}{n}\sum_{i=1}^{n}x^{(i)}\\[8pt]X_c&=X-\mu\end{aligned}`, 'derivation'],
  'center-mean': [String.raw`\mu=\begin{bmatrix}\frac{1+2+3}{3}\\[4pt]\frac{1+2+3}{3}\end{bmatrix}=\begin{bmatrix}2\\2\end{bmatrix}`, 'major'],
  'center-rows': [String.raw`\begin{aligned}x_c^{(1)}&=\begin{bmatrix}1\\1\end{bmatrix}-\begin{bmatrix}2\\2\end{bmatrix}=\begin{bmatrix}-1\\-1\end{bmatrix}\\[12pt]x_c^{(2)}&=\begin{bmatrix}2\\2\end{bmatrix}-\begin{bmatrix}2\\2\end{bmatrix}=\begin{bmatrix}0\\0\end{bmatrix}\\[12pt]x_c^{(3)}&=\begin{bmatrix}3\\3\end{bmatrix}-\begin{bmatrix}2\\2\end{bmatrix}=\begin{bmatrix}1\\1\end{bmatrix}\end{aligned}`, 'derivation'],
  'centered-x': [String.raw`\boxed{X_c=\begin{bmatrix}-1&-1\\0&0\\1&1\end{bmatrix}}`, 'major'],
  'center-check': [String.raw`\begin{aligned}\text{Centered feature 1 mean}&=\frac{-1+0+1}{3}=0\\[6pt]\text{Centered feature 2 mean}&=\frac{-1+0+1}{3}=0\end{aligned}`, 'display'],
  'center-only': [String.raw`x_{\text{centered}}=x-\mu`, 'display'],
  'standardize': [String.raw`x_{\text{standardized}}=\frac{x-\mu}{\sigma}`, 'display'],
  'cov-conventions': [String.raw`\begin{aligned}C_{\text{population}}&=\frac{X_c^TX_c}{n}\\[8pt]C_{\text{sample}}&=\frac{X_c^TX_c}{n-1}\end{aligned}`, 'major'],
  'xc-transpose': [String.raw`X_c=\begin{bmatrix}-1&-1\\0&0\\1&1\end{bmatrix}\qquad\Longrightarrow\qquad X_c^T=\begin{bmatrix}-1&0&1\\-1&0&1\end{bmatrix}`, 'display'],
  'cov-shapes': [String.raw`\underbrace{X_c^T}_{2\times3}\underbrace{X_c}_{3\times2}\longrightarrow\underbrace{C}_{2\times2}\qquad (2\times3)(3\times2)=2\times2`, 'major'],
  'cov-product': [String.raw`X_c^TX_c=\begin{bmatrix}-1&0&1\\-1&0&1\end{bmatrix}\begin{bmatrix}-1&-1\\0&0\\1&1\end{bmatrix}`, 'display'],
  'cov-product-result': [String.raw`\boxed{X_c^TX_c=\begin{bmatrix}2&2\\2&2\end{bmatrix}}`, 'major'],
  'cov-numeric': [String.raw`C=\frac{1}{3}\begin{bmatrix}2&2\\2&2\end{bmatrix}=\boxed{\begin{bmatrix}\frac23&\frac23\\[4pt]\frac23&\frac23\end{bmatrix}}`, 'major'],
  'cov-structure': [String.raw`C=\begin{bmatrix}\operatorname{Var}(F_1)&\operatorname{Cov}(F_1,F_2)\\[6pt]\operatorname{Cov}(F_2,F_1)&\operatorname{Var}(F_2)\end{bmatrix}`, 'display'],
  'projection-general': [String.raw`\begin{aligned}z_i&=u^Tx_c^{(i)}&&\text{scalar coordinate}\\[10pt]\widehat{x}_c^{(i)}&=\left(u^Tx_c^{(i)}\right)u&&\text{projected vector}\end{aligned}`, 'derivation'],
  'projection-x-axis': [String.raw`\begin{aligned}u&=\begin{bmatrix}1\\0\end{bmatrix},\qquad x_c^{(3)}=\begin{bmatrix}1\\1\end{bmatrix},\qquad u^Tu=1\\[10pt]z_3&=u^Tx_c^{(3)}=\begin{bmatrix}1&0\end{bmatrix}\begin{bmatrix}1\\1\end{bmatrix}=\boxed{1}\\[10pt]\widehat{x}_c^{(3)}&=(u^Tx_c^{(3)})u=1\begin{bmatrix}1\\0\end{bmatrix}=\boxed{\begin{bmatrix}1\\0\end{bmatrix}}\end{aligned}`, 'derivation'],
  'diagonal-normalize': [String.raw`\begin{aligned}v&=\begin{bmatrix}1\\1\end{bmatrix},\qquad \lVert v\rVert=\sqrt{1^2+1^2}=\sqrt2\\[10pt]u&=\frac{v}{\lVert v\rVert}=\boxed{\begin{bmatrix}\frac1{\sqrt2}\\[4pt]\frac1{\sqrt2}\end{bmatrix}},\qquad u^Tu=1\end{aligned}`, 'major'],
  'project-all': [String.raw`\begin{aligned}z_1&=u^Tx_c^{(1)}=\frac{-1-1}{\sqrt2}=-\sqrt2\\[7pt]z_2&=u^Tx_c^{(2)}=0\\[7pt]z_3&=u^Tx_c^{(3)}=\frac{1+1}{\sqrt2}=\sqrt2\end{aligned}`, 'derivation'],
  'projected-z': [String.raw`\boxed{Z=\begin{bmatrix}-\sqrt2&0&\sqrt2\end{bmatrix}}`, 'major'],
  'manual-z-variance': [String.raw`\begin{aligned}\bar z&=\frac{-\sqrt2+0+\sqrt2}{3}=0\\[8pt]\operatorname{Var}(Z)&=\frac{(-\sqrt2)^2+0^2+(\sqrt2)^2}{3}\\[5pt]&=\frac{2+0+2}{3}=\boxed{\frac43}\end{aligned}`, 'derivation'],
  'variance-general-start': [String.raw`\begin{aligned}z_i&=u^Tx^{(i)}\\[5pt]\bar z&=u^T\bar x\\[8pt]\operatorname{Var}(z)&=\frac1n\sum_{i=1}^{n}(z_i-\bar z)^2\end{aligned}`, 'derivation'],
  'variance-substitute': [String.raw`\operatorname{Var}(z)=\frac1n\sum_{i=1}^{n}\left[u^T\left(x^{(i)}-\bar x\right)\right]^2`, 'major'],
  'scalar-square': [String.raw`\begin{aligned}(u^Ta)^2&=(u^Ta)(u^Ta)^T\\[5pt]&=(u^Ta)(a^Tu)\\[5pt]&=u^T(aa^T)u\end{aligned}`, 'derivation'],
  'square-observation': [String.raw`\left[u^T\left(x^{(i)}-\bar x\right)\right]^2=u^T\left[\left(x^{(i)}-\bar x\right)\left(x^{(i)}-\bar x\right)^T\right]u`, 'display'],
  'variance-covariance': [String.raw`\begin{aligned}\operatorname{Var}(z)&=\frac1n\sum_{i=1}^{n}u^T\left[\left(x^{(i)}-\bar x\right)\left(x^{(i)}-\bar x\right)^T\right]u\\[7pt]&=u^T\left[\frac1n\sum_{i=1}^{n}\left(x^{(i)}-\bar x\right)\left(x^{(i)}-\bar x\right)^T\right]u\end{aligned}`, 'derivation'],
  'variance-compact': [String.raw`\boxed{\operatorname{Var}(z)=u^TCu}`, 'major'],
  'cu-numeric': [String.raw`\begin{aligned}Cu&=\begin{bmatrix}\frac23&\frac23\\[3pt]\frac23&\frac23\end{bmatrix}\begin{bmatrix}\frac1{\sqrt2}\\[3pt]\frac1{\sqrt2}\end{bmatrix}\\[8pt]&=\begin{bmatrix}\frac4{3\sqrt2}\\[3pt]\frac4{3\sqrt2}\end{bmatrix}=\frac43u\end{aligned}`, 'derivation'],
  'utcu-numeric': [String.raw`u^TCu=u^T\left(\frac43u\right)=\frac43(u^Tu)=\boxed{\frac43}`, 'major'],
  'maximize-variance': [String.raw`\boxed{\max_{u}\;u^TCu\qquad\text{subject to}\qquad u^Tu=1}`, 'major'],
  'eigenvalues-det': [String.raw`\begin{aligned}\det(C-\lambda I)&=\det\begin{bmatrix}\frac23-\lambda&\frac23\\[3pt]\frac23&\frac23-\lambda\end{bmatrix}=0\\[8pt]\left(\frac23-\lambda\right)^2-\frac49&=0\\[5pt]\lambda^2-\frac43\lambda&=0\\[5pt]\lambda\left(\lambda-\frac43\right)&=0\end{aligned}`, 'derivation'],
  'eigenvalues-result': [String.raw`\boxed{\lambda_1=\frac43\qquad\lambda_2=0}`, 'major'],
  'eigenvector-one': [String.raw`\begin{aligned}(C-\tfrac43I)v&=0\\-\tfrac23v_1+\tfrac23v_2&=0\Rightarrow v_2=v_1\\u_1&=\frac1{\sqrt2}\begin{bmatrix}1\\1\end{bmatrix}\end{aligned}`, 'derivation'],
  'eigenvector-two': [String.raw`\begin{aligned}Cv&=0\\\tfrac23v_1+\tfrac23v_2&=0\Rightarrow v_2=-v_1\\u_2&=\frac1{\sqrt2}\begin{bmatrix}1\\-1\end{bmatrix}\end{aligned}`, 'derivation'],
  'eigenvalue-variance-proof': [String.raw`\begin{aligned}Cu&=\lambda u\\[6pt]u^TCu&=u^T(\lambda u)\\[5pt]&=\lambda(u^Tu)\\[5pt]u^Tu&=1\\[7pt]\therefore\quad\boxed{u^TCu=\lambda}\end{aligned}`, 'derivation'],
  'lagrange-objective': [String.raw`\max_u\;u^TCu\qquad\text{subject to}\qquad u^Tu=1`, 'major'],
  'lagrange-steps': [String.raw`\begin{aligned}L(u,\lambda)&=u^TCu-\lambda(u^Tu-1)\\[10pt]\frac{\partial L}{\partial u}&=0\\[7pt]2Cu-2\lambda u&=0\\[7pt]\boxed{Cu=\lambda u}\end{aligned}`, 'derivation'],
  'pc-final': [String.raw`\boxed{PC_1=u_1=\frac1{\sqrt2}\begin{bmatrix}1\\1\end{bmatrix}},\qquad\operatorname{Var}(PC_1)=\lambda_1=\frac43`, 'major']
};

lecture48?.querySelectorAll('.pca-derivation-math[data-derivation-math]').forEach((placeholder) => {
  const entry = derivationMath[placeholder.dataset.derivationMath];
  if (entry) placeholder.replaceWith(makeMath(entry[0], entry[1]));
});

const summaryMath = {
  'single-vs-matrix-projection': [String.raw`\begin{aligned}\text{One observation:}\quad z&=U_k^Tx_c\\[7pt]\text{All row-observations:}\quad Z&=X_cU_k\in\mathbb{R}^{n\times k}\end{aligned}`, 'major'],
  'why-pc1': [String.raw`\begin{aligned}\operatorname{Var}(u^Tx_c)&=u^TCu\\[6pt]Cu&=\lambda u,\qquad u^Tu=1\\[6pt]u^TCu&=u^T(\lambda u)=\lambda\\[9pt]\therefore\quad \lambda_{\max}&\longrightarrow\text{maximum variance}\longrightarrow PC_1=e_1\end{aligned}`, 'derivation'],
  'evr-summary': [String.raw`\begin{aligned}\operatorname{EVR}_i&=\frac{\lambda_i}{\sum_{j=1}^{p}\lambda_j}\\[7pt]\text{Cumulative EVR for top }k&=\frac{\lambda_1+\cdots+\lambda_k}{\lambda_1+\cdots+\lambda_p}\\[9pt]\lambda&=\begin{bmatrix}12&5&2&1\end{bmatrix},\qquad\sum_j\lambda_j=20\end{aligned}`, 'derivation'],
  'orthogonality-summary': [String.raw`\begin{aligned}e_i^Te_j&=0\quad(i\ne j)\\[5pt]\angle(e_i,e_j)&=90^\circ\\[8pt]U^TCU&=\operatorname{diag}(\lambda_1,\ldots,\lambda_p)\\[5pt]\operatorname{Cov}(PC_i,PC_j)&=0\quad(i\ne j)\end{aligned}`, 'derivation'],
  'summary-center': [String.raw`x_c=x-\mu`, 'display'],
  'summary-standardize': [String.raw`x_{\mathrm{std}}=\frac{x-\mu}{\sigma}`, 'display'],
  'reconstruction-summary': [String.raw`\begin{aligned}\text{One PC:}\quad z&=u^T(x-\mu),&\widehat{x}&=\mu+zu\\[7pt]\text{Top }k\text{ PCs:}\quad z&=U_k^T(x-\mu),&\widehat{x}&=\mu+U_kz\end{aligned}`, 'derivation']
};

lecture48?.querySelectorAll('.pca-summary-math[data-summary-math]').forEach((placeholder) => {
  const entry = summaryMath[placeholder.dataset.summaryMath];
  if (entry) placeholder.replaceWith(makeMath(entry[0], entry[1]));
});

const gate2025Article = articleByTitle(lecture48, 'GATE DA 2025 — Q60');
const gate2025Question = gate2025Article?.querySelector('h4:nth-of-type(1) + p');
if (gate2025Question) {
  gate2025Question.textContent = 'Given dataset and notation:';
  const givens = document.createElement('div');
  givens.className = 'pca-shape-stack';
  givens.append(
    makeMath(String.raw`D=\left\{x^{(1)},x^{(2)},\ldots,x^{(n)}\right\}`, 'display'),
    makeMath(String.raw`x^{(i)}\in\mathbb{R}^{100}\qquad \sum_{i=1}^{n}x^{(i)}=0`, 'display'),
    makeMath(String.raw`\lambda_i=100^{2-i},\qquad 1\le i\le100`, 'display'),
    makeMath(String.raw`u\in\mathbb{R}^{100},\qquad u^Tu=1`, 'display')
  );
  gate2025Question.after(givens);
}
replaceFormula(gate2025Article, 0, String.raw`\boxed{\frac{1}{n}\sum_{i=1}^{n}\left(u^Tx^{(i)}\right)^2}`, 'major');

const orthogonalityArticle = articleByTitle(lecture48, 'PC2, PC3… aur orthogonality');
replaceFormula(orthogonalityArticle, 0, String.raw`\begin{aligned}C&=C^T\\Cv_i&=\lambda_i v_i,\qquad Cv_j=\lambda_jv_j\\[8pt]v_i^TCv_j&=\lambda_jv_i^Tv_j\\(Cv_i)^Tv_j&=\lambda_iv_i^Tv_j\\[8pt](\lambda_i-\lambda_j)v_i^Tv_j&=0\end{aligned}`, 'derivation');

const gate2026Article = articleByTitle(lecture48, 'GATE DA 2026 — Q11');
replaceFormula(gate2026Article, 0, String.raw`\begin{aligned}PC_1^TPC_{10}&=0\\[6pt]\cos\theta&=\frac{PC_1^TPC_{10}}{\lVert PC_1\rVert\,\lVert PC_{10}\rVert}=0\\[8pt]\boxed{\theta=90^\circ}\end{aligned}`, 'major');

const manualArticle = articleByTitle(lecture48, 'Complete manual example — 2D to 1D');
replaceFormula(manualArticle, 0, String.raw`X=\begin{bmatrix}2&0\\0&2\\3&1\\1&3\end{bmatrix},\qquad \mu=\begin{bmatrix}1.5&1.5\end{bmatrix}`, 'display');
replaceFormula(manualArticle, 0, String.raw`\begin{aligned}C&=\frac{X_c^TX_c}{3}=\begin{bmatrix}1.667&-1\\-1&1.667\end{bmatrix}\\[10pt]\lambda_1&\approx2.667,\qquad \lambda_2\approx0.667\\[6pt]PC_1&=\frac{1}{\sqrt2}\begin{bmatrix}1\\-1\end{bmatrix},\qquad PC_2=\frac{1}{\sqrt2}\begin{bmatrix}1\\1\end{bmatrix}\end{aligned}`, 'derivation');

const reductionArticle = articleByTitle(lecture48, 'Dimension reduction, EVR and reconstruction');
replaceFormula(reductionArticle, 0, String.raw`\begin{aligned}W_k&=\begin{bmatrix}v_1&v_2&\cdots&v_k\end{bmatrix}\in\mathbb{R}^{p\times k}\\[6pt]Z&=X_cW_k\in\mathbb{R}^{n\times k}\\[6pt]\widehat X&=ZW_k^T+\mu\end{aligned}`, 'derivation');
replaceFormula(reductionArticle, 0, String.raw`\begin{aligned}\operatorname{EVR}_i&=\frac{\lambda_i}{\sum_j\lambda_j}\\[8pt]\operatorname{trace}(C)&=\sum_j\lambda_j=\text{total variance}\\[6pt]\text{discarded variance}&=\sum_{j\,\in\,\text{dropped PCs}}\lambda_j\end{aligned}`, 'major');

const shapeArticle = articleByTitle(lecture49, 'Matrix shapes — mathematical vs sklearn orientation');
replaceFormula(shapeArticle, 0, String.raw`\begin{aligned}\text{Mathematics:}\quad Z&=X_cW\\[5pt]\text{sklearn:}\quad Z&=X_c\left(\texttt{pca.components\_}\right)^T\end{aligned}`, 'display');

const finalFormulaArticle = articleByTitle(lecture48, 'Formula sheet + two checklists');
replaceFormula(finalFormulaArticle, 0, String.raw`\begin{aligned}X_c&=X-\mu\\C&=\frac{X_c^TX_c}{n-1}\\z_i&=u^Tx_c^{(i)}\\\operatorname{Var}(z)&=u^TCu\\Cu&=\lambda u\\\operatorname{EVR}_i&=\frac{\lambda_i}{\sum_j\lambda_j}\\Z&=X_cW_k\\\widehat X&=ZW_k^T+\mu\\\operatorname{trace}(C)&=\sum_i\lambda_i\end{aligned}`, 'derivation');

const lecture47Variance = articleByTitle(lecture47, 'Variance ko maximize kyu karte hain?');
replaceFormula(lecture47Variance, 0, String.raw`\operatorname{Var}(X)=\frac{1}{n}\sum_{i=1}^{n}(x_i-\bar x)^2`, 'major');

const inlineMathDictionary = {
  'X ∈ ℝⁿˣᵖ': String.raw`X\in\mathbb{R}^{n\times p}`,
  'x⁽ⁱ⁾ ∈ ℝᵖ': String.raw`x^{(i)}\in\mathbb{R}^{p}`,
  'μ ∈ ℝᵖ': String.raw`\mu\in\mathbb{R}^{p}`,
  'Xc = X − μ': String.raw`X_c=X-\mu`,
  'u ∈ ℝᵖ': String.raw`u\in\mathbb{R}^{p}`,
  'zᵢ = uᵀx⁽ⁱ⁾': String.raw`z_i=u^Tx^{(i)}`,
  'C ∈ ℝᵖˣᵖ': String.raw`C\in\mathbb{R}^{p\times p}`,
  'λ, v': String.raw`\lambda,\,v`,
  'Σᵢx⁽ⁱ⁾ = 0': String.raw`\sum_i x^{(i)}=0`,
  'uᵀu = 1': String.raw`u^Tu=1`,
  'uᵀx⁽ⁱ⁾': String.raw`u^Tx^{(i)}`,
  'λᵢ': String.raw`\lambda_i`,
  'λmax': String.raw`\lambda_{\max}`,
  'PC1': String.raw`PC_1`,
  'PC2': String.raw`PC_2`,
  'PC10': String.raw`PC_{10}`,
  'PC₁ᵀPC₁₀ = 0': String.raw`PC_1^TPC_{10}=0`,
  'Cᵀ=C': String.raw`C^T=C`,
  'Cv=λv': String.raw`Cv=\lambda v`,
  'Z=X−μ': String.raw`Z=X-\mu`,
  'XcW': String.raw`X_cW`,
  'Wᵀ': String.raw`W^T`,
  'I−11ᵀ/n': String.raw`I-\frac{11^T}{n}`,
  'M²=M': String.raw`M^2=M`,
  'M²=I': String.raw`M^2=I`,
  'trace(C)=Σλᵢ': String.raw`\operatorname{trace}(C)=\sum_i\lambda_i`
  , 'μ=(1/n)Σᵢx⁽ⁱ⁾': String.raw`\mu=\frac1n\sum_i x^{(i)}`
  , 'x_c=x−μ': String.raw`x_c=x-\mu`
  , 'C=(1/n)Σᵢx_c⁽ⁱ⁾(x_c⁽ⁱ⁾)ᵀ': String.raw`C=\frac1n\sum_i x_c^{(i)}(x_c^{(i)})^T`
  , 'z=uᵀx_c': String.raw`z=u^Tx_c`
  , 'x_proj=(uᵀx_c)u': String.raw`x_{\mathrm{proj}}=(u^Tx_c)u`
  , 'Var(z)=uᵀCu': String.raw`\operatorname{Var}(z)=u^TCu`
  , 'Cu=λu': String.raw`Cu=\lambda u`
  , 'Var(z)=λ': String.raw`\operatorname{Var}(z)=\lambda`
  , 'EVRᵢ=λᵢ/Σⱼλⱼ': String.raw`\operatorname{EVR}_i=\frac{\lambda_i}{\sum_j\lambda_j}`
  , 'trace(C)=Σᵢλᵢ': String.raw`\operatorname{trace}(C)=\sum_i\lambda_i`
  , 'z=Uₖᵀx_c': String.raw`z=U_k^Tx_c`
  , 'x̂=μ+Uₖz': String.raw`\widehat{x}=\mu+U_kz`
  , 'y': String.raw`y`
  , 'd': String.raw`d`
  , 'd′': String.raw`d'`
  , 'd > d′': String.raw`d>d'`
  , 'd ≈ d′': String.raw`d\approx d'`
  , 'd₁': String.raw`d_1`
  , 'd₂': String.raw`d_2`
  , 'p=100': String.raw`p=100`
  , 'n': String.raw`n`
  , '(X−μ)/σ': String.raw`\frac{X-\mu}{\sigma}`
  , 'XcᵀXc': String.raw`X_c^TX_c`
  , 'zᵢ': String.raw`z_i`
  , 'uᵀu=1': String.raw`u^Tu=1`
  , 'D = {x⁽¹⁾,…,x⁽ⁿ⁾}': String.raw`D=\{x^{(1)},\ldots,x^{(n)}\}`
  , 'x⁽ⁱ⁾': String.raw`x^{(i)}`
  , 'x⁽ⁱ⁾ ∈ ℝ¹⁰⁰': String.raw`x^{(i)}\in\mathbb{R}^{100}`
  , 'u': String.raw`u`
  , 'Σᵢx⁽ⁱ⁾ = 0 ⇒ x̄ = (1/n)Σᵢx⁽ⁱ⁾ = 0': String.raw`\sum_i x^{(i)}=0\Rightarrow\bar x=\frac1n\sum_i x^{(i)}=0`
  , 'z̄ = uᵀx̄ = 0': String.raw`\bar z=u^T\bar x=0`
  , '(1/n)Σᵢ(uᵀx⁽ⁱ⁾)² = (1/n)Σᵢ(zᵢ−z̄)²': String.raw`\frac1n\sum_i(u^Tx^{(i)})^2=\frac1n\sum_i(z_i-\bar z)^2`
  , 'λ₁ = 100^(2−1)=100': String.raw`\lambda_1=100^{2-1}=100`
  , 'λ₂=100⁰=1': String.raw`\lambda_2=100^0=1`
  , 'λ₃=100⁻¹=0.01': String.raw`\lambda_3=100^{-1}=0.01`
  , 'λmax=100': String.raw`\lambda_{\max}=100`
  , '1/n': String.raw`\frac1n`
  , '1/(n−1)': String.raw`\frac1{n-1}`
  , 'vᵢᵀvⱼ=0': String.raw`v_i^Tv_j=0`
  , 'θ': String.raw`\theta`
  , '0°': String.raw`0^\circ`
  , '90°': String.raw`90^\circ`
  , '90° < θ ≤ 180°': String.raw`90^\circ<\theta\le180^\circ`
  , '0° < θ < 90°': String.raw`0^\circ<\theta<90^\circ`
  , '100 → 10': String.raw`100\longrightarrow10`
  , 'S': String.raw`S`
  , 'Z=Xc·u₁ ≈ [1.414, −1.414, 1.414, −1.414]': String.raw`Z=X_cu_1\approx[1.414,-1.414,1.414,-1.414]`
  , '2.667/(2.667+0.667)=0.80': String.raw`\frac{2.667}{2.667+0.667}=0.80`
  , '[−1,1]/√2': String.raw`\frac{[-1,1]}{\sqrt2}`
  , 'k=p': String.raw`k=p`
  , 'k<p': String.raw`k<p`
  , 'Xc=X−μ': String.raw`X_c=X-\mu`
  , 'Z=XcW': String.raw`Z=X_cW`
  , 'W': String.raw`W`
  , 'Z=XW': String.raw`Z=XW`
  , 'k=d': String.raw`k=d`
  , 'k<d': String.raw`k<d`
  , 'U': String.raw`U`
  , 'ℝ³': String.raw`\mathbb{R}^3`
  , 'M∈ℝ³ˣ³': String.raw`M\in\mathbb{R}^{3\times3}`
  , 'M³=M': String.raw`M^3=M`
  , 'M': String.raw`M`
  , 'null(M)': String.raw`\operatorname{null}(M)`
  , 'rank(M)=dim(U)': String.raw`\operatorname{rank}(M)=\dim(U)`
  , 'nullity=3−rank': String.raw`\operatorname{nullity}=3-\operatorname{rank}`
  , 'M³=M²M=MM=M²=M': String.raw`M^3=M^2M=MM=M^2=M`
  , 'WₖWₖᵀ': String.raw`W_kW_k^T`
  , 'M = Iₙ − (1/n)11ᵀ': String.raw`M=I_n-\frac1n11^T`
  , '1=(1,…,1)ᵀ': String.raw`\mathbf1=(1,\ldots,1)^T`
  , 'Mᵀ=M': String.raw`M^T=M`
  , 'M²=Iₙ': String.raw`M^2=I_n`
  , 'trace(M)=n': String.raw`\operatorname{trace}(M)=n`
  , '11ᵀ': String.raw`11^T`
  , 'Iₙ': String.raw`I_n`
  , 'trace(M)': String.raw`\operatorname{trace}(M)`
  , '1ᵀ1=n': String.raw`1^T1=n`
  , 'trace(M)=n−(1/n)trace(11ᵀ)=n−1': String.raw`\operatorname{trace}(M)=n-\frac1n\operatorname{trace}(11^T)=n-1`
  , 'A = [[1,0,0],[0,cos t,sin t],[0,−sin t,cos t]]': String.raw`A=\begin{bmatrix}1&0&0\\0&\cos t&\sin t\\0&-\sin t&\cos t\end{bmatrix}`
  , 'γ₁,γ₂,γ₃': String.raw`\gamma_1,\gamma_2,\gamma_3`
  , 't∈[−π,π]': String.raw`t\in[-\pi,\pi]`
  , 'γ₁+γ₂+γ₃=1+√2': String.raw`\gamma_1+\gamma_2+\gamma_3=1+\sqrt2`
  , 'γ₁+γ₂+γ₃': String.raw`\gamma_1+\gamma_2+\gamma_3`
  , 'trace(A)': String.raw`\operatorname{trace}(A)`
  , '2×2 block': String.raw`2\times2\ \text{block}`
  , 'Σγᵢ=trace(A)': String.raw`\sum_i\gamma_i=\operatorname{trace}(A)`
  , 'trace(A)=1+cos t+cos t=1+2cos t': String.raw`\operatorname{trace}(A)=1+\cos t+\cos t=1+2\cos t`
  , '1+2cos t=1+√2 ⇒ cos t=√2/2': String.raw`1+2\cos t=1+\sqrt2\Rightarrow\cos t=\frac{\sqrt2}{2}`
  , '[−π,π]': String.raw`[-\pi,\pi]`
  , 't=π/4': String.raw`t=\frac\pi4`
  , '−π/4': String.raw`-\frac\pi4`
};
renderInlineMath(lecture47, inlineMathDictionary);
renderInlineMath(lecture48, inlineMathDictionary);
renderInlineMath(lecture49, inlineMathDictionary);
