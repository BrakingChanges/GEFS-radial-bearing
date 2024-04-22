import { build } from "vite";
import { writeFile } from "node:fs/promises";

const res = await build()

await writeFile('userscript.js', `
// ==UserScript==
// @name         Geofs Interface
// @namespace    http://github.com/Tech-Helper503/GEFS-radial-bearing
// @version      0.1
// @description  Connects to the EFB via a WebSocket connection
// @author       Aiden Israel
// @match        https://www.geo-fs.com/geofs.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=opera.com
// @grant        none
// ==/UserScript==

${res.output[0].code}
`)

console.log('UserScript succesfully built')
