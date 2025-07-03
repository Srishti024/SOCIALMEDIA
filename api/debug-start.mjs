import { pathToFileURL } from "url";

// Point to your real index.js
const realEntry = pathToFileURL("./index.js").href;
console.log("🕵️ Launching real app from:", realEntry);

// Dynamically import with trace
try {
  await import(realEntry);
} catch (err) {
  console.error("❌ Crash during import:");
  console.error(err.stack || err);
}
