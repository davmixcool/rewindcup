import { rmSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";

const urlFile = new URL("../.dev-url", import.meta.url);
const nextBin = new URL("../node_modules/next/dist/bin/next", import.meta.url);
let selectedUrl = null;

rmSync(urlFile, { force: true });

const child = spawn(process.execPath, [nextBin.pathname, "dev", "--hostname", "localhost", "--port", "0"], {
  env: process.env,
  stdio: ["inherit", "pipe", "pipe"]
});

function forwardAndCapture(stream, destination) {
  stream.on("data", (chunk) => {
    destination.write(chunk);
    if (selectedUrl) return;

    const match = chunk.toString().match(/http:\/\/localhost:(\d+)/);
    if (!match) return;

    selectedUrl = `http://localhost:${match[1]}`;
    writeFileSync(urlFile, `${selectedUrl}\n`, "utf8");
    process.stdout.write(`\nRecorded dev server URL: ${selectedUrl}\n`);
  });
}

forwardAndCapture(child.stdout, process.stdout);
forwardAndCapture(child.stderr, process.stderr);

child.on("error", (error) => {
  rmSync(urlFile, { force: true });
  console.error(error);
  process.exitCode = 1;
});

child.on("exit", (code, signal) => {
  rmSync(urlFile, { force: true });
  if (signal) process.kill(process.pid, signal);
  else process.exitCode = code ?? 1;
});
