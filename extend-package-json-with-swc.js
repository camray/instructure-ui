const fsp = require('node:fs/promises')
const path = require('node:path')

const EXCLUDED_PACKAGES = ['__docs__', '__examples__']
const SWCRC_PATH = path.resolve('./.swcrc')

const log = (stuff) => {
  console.log(JSON.stringify(stuff, null, 2))
}
const run = async () => {
  const packages = await fsp.opendir('./packages')

  for await (let pkg of packages) {
    if (EXCLUDED_PACKAGES.includes(pkg.name)) {
      continue
    }
    // if the pkg has a babel.config.json then copy an .swrc to it
    // and add a `build_swc` script to its package.json
    let pkg_path = path.resolve('./packages', pkg.name)
    let babel_path = `${pkg_path}/babel.config.js`

    let babel_exists = false
    try {
      let stats = await fsp.stat(babel_path)
      babel_exists = true
    } catch (_) {
      babel_exists = false
    }

    console.log(`Does babel exist for package: ${pkg.name}? - ${babel_exists}`)

    if (babel_exists) {
      // console.log(`${pkg_path}/package.json`)
      // await fsp.copyFile(SWCRC_PATH, `${pkg_path}/.swcrc`)
      const package_json_path = `${pkg_path}/package.json`
      let package_json = await fsp.readFile(package_json_path, {
        encoding: 'utf8'
      })

      let package_as_json = JSON.parse(package_json)
      let overridden = {
        ...package_as_json,
        scripts: {
          ...package_as_json.scripts,
          build_swc_local:
            "swc  --extensions .ts,.tsx,.js,.jsx ./src --ignore 'src/**/*.test.js','src/**/__tests__/**' --out-dir swc-es"
        }
      }
      log(overridden)
      await fsp.writeFile(package_json_path, JSON.stringify(overridden))
    }
  }
}

run()
  .then(() => {
    console.log('successfully finished!')
  })
  .catch((e) => {
    console.error(e)
  })
