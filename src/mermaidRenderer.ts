import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, readFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';

const execAsync = promisify(exec);

/**
 * Get the path to the mmdc executable, trying multiple possible locations.
 */
function getMmdcPath(): string {
  const possiblePaths = [
    // Development environment - relative to src
    path.join(__dirname, '..', 'node_modules', '.bin', 'mmdc'),
    // Bundled extension - relative to dist
    path.join(__dirname, '..', '..', 'node_modules', '.bin', 'mmdc'),
    // Extension root
    path.join(__dirname, 'node_modules', '.bin', 'mmdc'),
    // Try the package directly
    path.join(__dirname, '..', 'node_modules', '@mermaid-js', 'mermaid-cli', 'src', 'cli.js'),
    path.join(__dirname, '..', '..', 'node_modules', '@mermaid-js', 'mermaid-cli', 'src', 'cli.js'),
  ];

  // Try each path and return the first one that exists
  const fs = require('fs');
  for (const testPath of possiblePaths) {
    try {
      if (fs.existsSync(testPath)) {
        console.log(`Found mmdc at: ${testPath}`);
        return testPath;
      }
    } catch {
      // Continue to next path
    }
  }

  // Fallback to direct path that we know works in development
  const fallbackPath = path.join(__dirname, '..', 'node_modules', '.bin', 'mmdc');
  console.log(`Using fallback mmdc path: ${fallbackPath}`);
  return fallbackPath;
}

/**
 * Render a Mermaid diagram string to an SVG string using mermaid-cli.
 * 
 * This approach uses the official mermaid CLI tool which is much faster
 * and more reliable than Puppeteer for server-side rendering.
 */
export async function renderMermaidToSvg(code: string, options: { theme?: string } = {}): Promise<string> {
  const tempDir = tmpdir();
  const inputFile = path.join(tempDir, `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.mmd`);
  const outputFile = path.join(tempDir, `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.svg`);

  try {
    // Write mermaid code to temp file
    await writeFile(inputFile, code, 'utf8');

    // Build mmdc command using local executable
    const mmdcPath = getMmdcPath();
    const theme = options.theme || 'default';
    
    // Use absolute paths and explicit node execution
    const cmd = `node "${mmdcPath}" -i "${inputFile}" -o "${outputFile}" -t "${theme}" -b white`;

    console.log(`Executing: ${cmd}`);
    console.log(`Working directory: ${process.cwd()}`);
    
    // Execute mermaid CLI with explicit environment
    const { stdout, stderr } = await execAsync(cmd, {
      cwd: path.dirname(mmdcPath),
      timeout: 30000, // 30 second timeout
      env: { ...process.env, NODE_ENV: 'production' }
    });
    
    if (stderr) {
      console.warn('mmdc stderr:', stderr);
    }
    
    if (stdout) {
      console.log('mmdc stdout:', stdout);
    }

    // Check if output file was created
    try {
      const stats = await require('fs').promises.stat(outputFile);
      if (stats.size === 0) {
        throw new Error('Generated SVG file is empty');
      }
    } catch (statError) {
      throw new Error(`Output file not created or empty: ${outputFile}`);
    }

    // Read the generated SVG
    const svg = await readFile(outputFile, 'utf8');
    return svg;
  } catch (error) {
    console.error('Failed to render Mermaid diagram:', error);
    throw new Error(`Mermaid rendering failed: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    // Clean up temp files
    try {
      await unlink(inputFile);
    } catch {}
    try {
      await unlink(outputFile);
    } catch {}
  }
}

/**
 * PNG rendering is available via mermaid CLI by changing the output extension.
 * Call this function to render to PNG instead of SVG.
 */
export async function renderMermaidToPng(code: string, options: { theme?: string } = {}): Promise<Buffer> {
  const tempDir = tmpdir();
  const inputFile = path.join(tempDir, `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.mmd`);
  const outputFile = path.join(tempDir, `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`);

  try {
    // Write mermaid code to temp file
    await writeFile(inputFile, code, 'utf8');

    // Build mmdc command for PNG output using local executable
    const mmdcPath = getMmdcPath();
    const theme = options.theme || 'default';
    const cmd = `node "${mmdcPath}" -i "${inputFile}" -o "${outputFile}" -t "${theme}" -b white`;

    console.log(`Executing: ${cmd}`);

    // Execute mermaid CLI with explicit environment
    const { stdout, stderr } = await execAsync(cmd, {
      cwd: path.dirname(mmdcPath),
      timeout: 30000,
      env: { ...process.env, NODE_ENV: 'production' }
    });
    
    if (stderr) {
      console.warn('mmdc stderr:', stderr);
    }
    
    if (stdout) {
      console.log('mmdc stdout:', stdout);
    }

    // Check if output file was created
    try {
      const stats = await require('fs').promises.stat(outputFile);
      if (stats.size === 0) {
        throw new Error('Generated PNG file is empty');
      }
    } catch (statError) {
      throw new Error(`Output file not created or empty: ${outputFile}`);
    }

    // Read the generated PNG
    const png = await readFile(outputFile);
    return png;
  } catch (error) {
    console.error('Failed to render Mermaid diagram:', error);
    throw new Error(`Mermaid rendering failed: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    // Clean up temp files
    try {
      await unlink(inputFile);
    } catch {}
    try {
      await unlink(outputFile);
    } catch {}
  }
}

export default { renderMermaidToSvg, renderMermaidToPng };
