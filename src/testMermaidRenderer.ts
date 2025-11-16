import { writeFile } from 'fs/promises';
import path from 'path';
import { renderMermaidToSvg, renderMermaidToPng } from './mermaidRenderer';

async function main() {
  const diagram = `
graph TD
  A[Start] --> B{Is it working?}
  B -- Yes --> C[Great]
  B -- No --> D[Fix it]
  style C fill:#9f6,stroke:#333,stroke-width:2px
`;

  console.log('Rendering SVG...');
  const svg = await renderMermaidToSvg(diagram, { theme: 'default' });
  const svgPath = path.resolve('test-output', 'diagram.svg');
  await writeFile(svgPath, svg, 'utf8');
  console.log(`✓ Wrote ${svgPath}`);

  console.log('Rendering PNG...');
  const png = await renderMermaidToPng(diagram, { theme: 'default' });
  const pngPath = path.resolve('test-output', 'diagram.png');
  await writeFile(pngPath, png);
  console.log(`✓ Wrote ${pngPath}`);

  console.log('✅ Rendering complete using mermaid-cli (fast and reliable!)');
}

main().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
