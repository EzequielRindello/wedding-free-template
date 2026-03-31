import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';

const HOST = '127.0.0.1';
const PORT = 4173;
const TARGET_URL = `http://${HOST}:${PORT}/`;
const PERF_DIR = path.resolve(process.cwd(), 'perf');
const BASELINE_FILE = path.join(PERF_DIR, 'baseline.mobile.json');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const waitForServer = async (url, timeoutMs = 30000) => {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url, { method: 'GET' });
      if (response.ok || response.status === 404) {
        return true;
      }
    } catch {
      // Keep waiting until the preview server starts.
    }

    await sleep(500);
  }

  return false;
};

const prettySeconds = (msValue) => {
  if (typeof msValue !== 'number' || Number.isNaN(msValue)) {
    return null;
  }

  return Number((msValue / 1000).toFixed(2));
};

const run = async () => {
  const viteBinPath = path.resolve(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js');

  const previewProcess = spawn(process.execPath, [
    viteBinPath,
    'preview',
    '--host',
    HOST,
    '--port',
    String(PORT),
    '--strictPort'
  ], {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  previewProcess.stdout.on('data', (chunk) => {
    process.stdout.write(`[preview] ${chunk}`);
  });

  previewProcess.stderr.on('data', (chunk) => {
    process.stderr.write(`[preview] ${chunk}`);
  });

  let chrome;

  const cleanup = async () => {
    if (chrome) {
      await chrome.kill();
    }

    if (!previewProcess.killed) {
      previewProcess.kill('SIGTERM');
    }
  };

  try {
    const isServerReady = await waitForServer(TARGET_URL);
    if (!isServerReady) {
      throw new Error('No se pudo iniciar vite preview para perf:check.');
    }

    try {
      chrome = await launch({
        chromeFlags: ['--headless=new']
      });
    } catch (error) {
      console.warn('[perf:check] No se encontro un Chrome disponible para Lighthouse.');
      console.warn('[perf:check] Instala Chrome/Edge y vuelve a ejecutar npm run perf:check.');
      console.warn(`[perf:check] Detalle: ${error.message}`);
      return;
    }

    const runnerResult = await lighthouse(
      TARGET_URL,
      {
        port: chrome.port,
        output: 'json',
        logLevel: 'error',
        emulatedFormFactor: 'mobile',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo']
      }
    );

    const { lhr } = runnerResult;
    const lcp = lhr.audits['largest-contentful-paint']?.numericValue;
    const cls = lhr.audits['cumulative-layout-shift']?.numericValue;
    const inp = lhr.audits['interaction-to-next-paint']?.numericValue;

    const baseline = {
      generatedAt: new Date().toISOString(),
      url: TARGET_URL,
      scores: {
        performance: Math.round((lhr.categories.performance?.score || 0) * 100),
        accessibility: Math.round((lhr.categories.accessibility?.score || 0) * 100),
        bestPractices: Math.round((lhr.categories['best-practices']?.score || 0) * 100),
        seo: Math.round((lhr.categories.seo?.score || 0) * 100)
      },
      coreWebVitals: {
        lcpSeconds: prettySeconds(lcp),
        cls: Number((cls || 0).toFixed(3)),
        inpSeconds: prettySeconds(inp)
      },
      thresholds: {
        lcpSeconds: 2.5,
        cls: 0.1,
        inpSeconds: 0.2
      }
    };

    await mkdir(PERF_DIR, { recursive: true });
    await writeFile(BASELINE_FILE, `${JSON.stringify(baseline, null, 2)}\n`, 'utf8');

    console.log('\n=== Lighthouse Mobile Baseline ===');
    console.log(`Performance: ${baseline.scores.performance}`);
    console.log(`Accessibility: ${baseline.scores.accessibility}`);
    console.log(`Best Practices: ${baseline.scores.bestPractices}`);
    console.log(`SEO: ${baseline.scores.seo}`);
    console.log(`LCP (s): ${baseline.coreWebVitals.lcpSeconds}`);
    console.log(`CLS: ${baseline.coreWebVitals.cls}`);
    console.log(`INP (s): ${baseline.coreWebVitals.inpSeconds}`);
    console.log(`\nBaseline guardado en: ${path.relative(process.cwd(), BASELINE_FILE)}`);

    if (
      baseline.coreWebVitals.lcpSeconds > baseline.thresholds.lcpSeconds
      || baseline.coreWebVitals.cls > baseline.thresholds.cls
      || baseline.coreWebVitals.inpSeconds > baseline.thresholds.inpSeconds
    ) {
      console.warn('[perf:check] Se detectaron metricas por encima de umbrales recomendados.');
      console.warn('[perf:check] Revisar optimizaciones antes de publicar.');
    }
  } finally {
    await cleanup();
  }
};

run().catch((error) => {
  console.error('[perf:check] Error inesperado:', error);
  process.exitCode = 1;
});
