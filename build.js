import fs from "fs";
import { compilePack } from "@foundryvtt/foundryvtt-cli";
import AdmZip from "adm-zip";

const pack_path = "./packs";
const packs = ["actions", "actors", "effects", "feats", "items", "macros", "tables"];

const promises = [];
for (const dir of packs) {
  const src = `src/${dir}`;
  const out = `${pack_path}/${dir}`;
  promises.push(compilePack(src, out, { log: true, recursive: true }));
}
await Promise.all(promises);

const zip = new AdmZip();
for (const file of ["LICENSE", "module.json", "README.md"]) {
  zip.addLocalFile(file);
}
zip.addLocalFolder(pack_path, "/packs");
zip.writeZip("./packs.zip", (_) => fs.rmSync(pack_path, { recursive: true, force: true }));
