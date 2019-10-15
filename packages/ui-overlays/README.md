---
category: packages
---

## ui-overlays

[![npm][npm]][npm-url]
[![build-status][build-status]][build-status-url]
[![MIT License][license-badge]][LICENSE]
[![Code of Conduct][coc-badge]][coc]


### Installation

```sh
yarn add @instructure/ui-overlays
```

### Usage

```js
import React from 'react'
import { Mask } from '@instructure/ui-overlays'

const MyMask = () => {
  return (
    <Mask>
      <Text>Hello mask</Text>
    </Mask>
  )
}
```

### Components
The `ui-overlays` package contains the following:
- [Mask](#Mask)
- [Modal](#Modal)
- [Overlay](#Overlay)
- Popover will be removed in version 7.0.0. Use the [Popover from ui-popover](#Popover) instead.
- Tooltip will be removed in version 7.0.0. Use the [Tooltip from ui-tooltip](#Tooltip) instead.
- [Tray](#Tray)

### Contribute
See the [contributing guidelines](#contributing) for details.

### License

[MIT](LICENSE)

[npm]: https://img.shields.io/npm/v/@instructure/ui-overlays.svg
[npm-url]: https://npmjs.com/package/@instructure/ui-overlays

[build-status]: https://travis-ci.org/instructure/instructure-ui.svg?branch=master
[build-status-url]: https://travis-ci.org/instructure/instructure-ui "Travis CI"

[license-badge]: https://img.shields.io/npm/l/instructure-ui.svg?style=flat-square
[license]: https://github.com/instructure/instructure-ui/blob/master/LICENSE

[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/instructure/instructure-ui/blob/master/CODE_OF_CONDUCT.md