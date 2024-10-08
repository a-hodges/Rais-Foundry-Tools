import { compilePack } from "@foundryvtt/foundryvtt-cli";
import AdmZip from "adm-zip";

const packs = ["actions", "actors", "effects", "feats", "items", "macros", "tables"];

const promises = [];
for (const dir of packs) {
  const src = `src/${dir}`;
  const out = `packs/${dir}`;
  promises.push(compilePack(src, out, { log: true, recursive: true }));
}
await Promise.all(promises);

const zip = new AdmZip();
for (const file of ["LICENSE", "module.json", "README.md"]) {
  zip.addLocalFile(file);
}
zip.addLocalFolder("./packs", "/packs");
zip.writeZip("./packs.zip");
