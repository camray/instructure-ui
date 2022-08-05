#!/usr/bin/env node
const swc = require('@swc/core')
const fsp = require('node:fs/promises')
const path = require('node:path')
const globby = require('globby')

const EXCLUDED_PACKAGES = ['__docs__', '__examples__']
const SWC_OUTPUT_DIR = 'swc-node'
const jsParserOpts = {
  syntax: 'ecmascript',
  jsx: true
}
const tsParserOpts = (ext) => ({
  syntax: 'typescript',
  tsx: ext === 'tsx'
})

const parserOpts = {
  js: jsParserOpts,
  jsx: jsParserOpts,
  ts: tsParserOpts('ts'),
  tsx: tsParserOpts('tsx')
}

const getSwcOptions = (ext) => ({
  isModule: true,
  jsc: {
    parser: {
      ...parserOpts[ext],
      decorators: true,
      decoratorsBeforeExport: true
    },
    loose: false,
    externalHelpers: false,
    // Requires v1.2.50 or upper and requires target to be es2016 or upper.
    keepClassNames: false
  },
  env: {
    targets: [
      'last 2 chrome versions',
      'last 2 firefox versions',
      'last 2 edge versions',
      'last 2 ios versions',
      'last 2 opera versions',
      'last 2 safari versions',
      'last 2 ChromeAndroid versions'
    ]
  },
  minify: false
})

function getDirs(files) {
  return Array.from(
    new Set(
      files
        .map((file) => {
          const segments = file.split('/')
          segments.pop()
          return segments.join('/')
        })
        .map((file) => {
          return file.replace('src', SWC_OUTPUT_DIR)
        })
    )
  )
}

async function* run() {
  const packages = await fsp.opendir('./packages')
  for await (let pkg of packages) {
    if (EXCLUDED_PACKAGES.includes(pkg.name)) {
      continue
    }
    const pkg_path = `./packages/${pkg.name}`
    const files = await globby(`${pkg_path}/src/**/*{.ts,.tsx,.js,.jsx}`, {
      ignore: [
        `${pkg_path}/src/**/*.test.*`,
        `${pkg_path}/src/**/__tests__/**`,
        `${pkg_path}/src/**/__examples__/**`
      ]
    })
    //have to recreate the src directory structure in output directory
    const dirs = await Promise.all(
      getDirs(files).map((dir) => fsp.mkdir(dir, { recursive: true }))
    )

    //read the content of the files
    const fileContents = await Promise.allSettled(
      files
        .map((f) => {
          const ext = f.split('.').at(-1)
          return [fsp.readFile(f, { encoding: 'utf8' }), ext, f]
        })
        .map(async (arg) => {
          const [p, ext, path] = arg
          const resolved = await p
          const output = await transform([resolved, ext])
          // write the content to a file
          // filename should match the source file name
          const outputPath = path.replace('src', SWC_OUTPUT_DIR)
          const realPath = outputPath.replace(`.${ext}`, '.js')

          return fsp.writeFile(realPath, output.code)
        })
    )

    if (fileContents.some((filePromise) => filePromise.status === 'rejected')) {
      throw new Error(
        fileContents
          .filter((r) => r.status === 'rejected')
          .map((r) => r.reason)
          .join('\n')
      )
    }
    yield pkg.name
  }
}

//swc  --extensions .ts,.tsx,.js,.jsx ./src --ignore 'src/**/*.test.js','src/**/__tests__/**' --out-dir swc-es
const transform = (args) => {
  const [source, ext] = args
  return swc.transform(source, getSwcOptions(ext))
}
;(async () => {
  console.time('swc-from-node')
  for await (let transformed of run()) {
    // console.log(transformed)
  }
  console.timeEnd('swc-from-node')
})()
