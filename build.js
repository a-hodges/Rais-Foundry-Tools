import { compilePack } from "@foundryvtt/foundryvtt-cli";

const packs = ["actors", "items", "macros", "tables"];

const promises = [];
for (const dir of packs) {
  const src = `packs/src/${dir}`;
  const out = `packs/${dir}`;
  promises.push(compilePack(src, out));
}
await Promise.all(promises);
