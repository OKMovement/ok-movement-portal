import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const reactPdfPackagePath = require.resolve("react-pdf/package.json");
const reactPdfRoot = path.dirname(reactPdfPackagePath);
const sourceWorkerPath = path.join(reactPdfRoot, "..", "pdfjs-dist", "build", "pdf.worker.min.mjs");
const publicDir = path.resolve(process.cwd(), "public");
const targetWorkerPath = path.join(publicDir, "pdf.worker.min.mjs");

fs.mkdirSync(publicDir, { recursive: true });
fs.copyFileSync(sourceWorkerPath, targetWorkerPath);

console.log(`Synced PDF worker to ${targetWorkerPath}`);
