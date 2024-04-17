import esbuildPluginTsc from 'esbuild-plugin-tsc'


export const settings = {
    entryPoints: ['./src/index.ts'],
    bundle: true,
    outfile: 'out.js',
    plugins: [
        esbuildPluginTsc({
            force: true,
            tsconfigPath: 'tsconfig.json'
        })
    ]
}