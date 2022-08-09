#!/usr/bin/env node
const swc = require('@swc/core')
const fsp = require('node:fs/promises')
const path = require('node:path')
const globby = require('globby')

const PATH_TO_PLUGIN= '/Users/viktor.ohad/playground/rust/first-plugin/target/wasm32-wasi/release/swc_plugin_react_add_displayname.wasm'
const RESOLVED_PATH_TO_PLUGIN = require.resolve(PATH_TO_PLUGIN)

const EXCLUDED_PACKAGES = ['__docs__', '__examples__']
const SWC_OUTPUT_DIR = 'swc-node'
const jsParserOpts = {
  syntax: 'ecmascript',
  jsx: true,
      decoratorsBeforeExport: true,
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
    },
    preserveAllComments: false,
    loose: false,
    externalHelpers: true,
    // Requires v1.2.50 or upper and requires target to be es2016 or upper.
    keepClassNames: true,
      experimental: {
          plugins: [
              [
                  RESOLVED_PATH_TO_PLUGIN,
                  {}
              ]
          ]
      },
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
    // const pkg = {
    //     name: 'ui-badge'
    // }
    const pkgPath = `./packages/${pkg.name}`
    const pkgSourceFiles = `${pkgPath}/src/**/*{.tsx,.ts,.js,.jsx}`
    const files = await globby(pkgSourceFiles, {
      ignore: [
        `${pkgPath}/src/**/*.test.*`,
        `${pkgPath}/src/**/__tests__/**`,
        `${pkgPath}/src/**/__examples__/**`
      ]
    })
    // console.log("Matched files: ", files)
    //have to recreate the src directory structure in output directory
    const dirs = await Promise.all(
      getDirs(files).map((dir) => fsp.mkdir(dir, { recursive: true }))
    )

    //read the content of the files
    const fileContents = await Promise.allSettled(
      files.map(async (path) => {
        const ext = path.split('.').at(-1)
        const source = await fsp.readFile(path, { encoding: 'utf8' })
        const output = await swc.transform(source, getSwcOptions(ext))
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

;(async () => {
  console.time('swc-from-node')
  for await (let transformed of run()) {
    // console.log(transformed)
  }
  console.timeEnd('swc-from-node')
})()
