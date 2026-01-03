import { exec } from "child_process";

const servers = [
  "common-logic/server.js",
  "service-seeker/server.js",
  "service-provider-backend/server.js",
  "service-shops-backend/server.js",
  "admin-backend/apps/admin-backend/server.js"
];

servers.forEach(file => {
  const process = exec(`node ${file}`);
  process.stdout.on("data", data => console.log(`[${file}] ${data}`));
  process.stderr.on("data", data => console.error(`[${file} ERROR] ${data}`));
});
