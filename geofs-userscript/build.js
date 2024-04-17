import * as eslint from 'esbuild'
import { settings } from './settings'

await eslint.build(settings)


