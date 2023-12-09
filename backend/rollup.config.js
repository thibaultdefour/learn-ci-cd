import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import esbuild from 'rollup-plugin-esbuild'

export default {
    input: `index.ts`,
    output: {
        file: `release/index.cjs`,
        format: 'cjs',
    },
    plugins: [
        nodeResolve({ preferBuiltins: true }),
        commonjs(),
        json(),
        esbuild({ loaders: { '.json': 'json' } })
    ]
}
