"use strict";

import { settings } from '../../settings';
const { RoboHydraHeadFilesystem, RoboHydraHeadFilter, RoboHydraHeadProxy } =  await import('robohydra').heads;
import { join } from 'path';
import { build } from 'esbuild';

await build(settings)

const script = `<script src="build/testing/startScript.js"></script></head>`

export function getBodyParts () {
    return {
        heads: [
            new RoboHydraHeadFilesystem({
                mountPath: '/build',
                documentRoot: join(__dirname, '../. ')
            }),
            new RoboHydraHeadFilter({
                path: '/geofs.php*',
                filter: buffer => buffer.toString()
                .replace(/geofs\.masterDomain = '[^]*?'/, 'geofs.masterDomain = "127.0.0.1:3000"')
                .replace(/geofs\.url = '[^]*?'/, 'geofs.url = "http://127.0.0.1:3000"')
                .replace(/geofs\.localUrl = '[^]*?'/, 'geofs.localUrl = "http://127.0.0.1:3000"')
                .replace(/geofs\.jsapiKey = '[^]*?'/, 'geofs.jsapiKey = "AIzaSyBlCxVOtJO6rKOmWnIhHSWx2EHzU_7hakQ"')
                .replace('</head>', script)
            }),
            new RoboHydraHeadProxy({
                mountPath: '/',
                proxyTo: 'http://www.geo-fs.com/',
                setHostHeader: true
            })
        ]
    }
}
