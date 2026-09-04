import katex from 'katex';
import 'katex/dist/katex.min.css';

const style = document.createElement('style');
style.textContent = `
  .regression-math {
    overflow-x: auto;
    margin: 16px 0;
    padding: 16px 18px;
    border: 1px solid rgba(85, 200, 196, .42);
    border-radius: 12px;
    background: rgba(16, 61, 66, .52);
    color: #e9f4f1;
  }
  .regression-math.compact {
    display: inline-block;
    margin: 9px 0 7px;
    padding: 7px 10px;
  }
  .regression-math .katex-display { margin: 0; min-width: max-content; }
  .regression-math .katex { font-size: 1.24em; }
  .regression-math-inline { display: inline-block; vertical-align: baseline; }
  .regression-math-inline .katex { font-size: 1.04em; }
  .table-wrap .regression-math-inline .katex { font-size: .96em; }
  @media (max-width: 680px) {
    .regression-math { padding: 13px; }
    .regression-math .katex { font-size: 1.08em; }
  }
`;
document.head.append(style);

document.querySelectorAll('[data-regression-math]').forEach((element) => {
  katex.render(element.dataset.regressionMath, element, {
    displayMode: true,
    throwOnError: false,
    strict: false,
  });
});

document.querySelectorAll('[data-regression-math-inline]').forEach((element) => {
  katex.render(element.dataset.regressionMathInline, element, {
    displayMode: false,
    throwOnError: false,
    strict: false,
  });
});
