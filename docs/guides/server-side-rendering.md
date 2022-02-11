---
title: Server side rendering (SSR)
category: Guides
order: 1
---

# SSR with Next.js

This document will demonstrate how to achieve Server Side Rendering (SSR) with [Next.js](https://nextjs.org/) using InstUI components.

> This document assumes that you already have a Next.js application in place.

#### Initial steps

- install InstUI related dependencies:

```sh
yarn add @instructure/emotion @instructure/ui-react-utils
```

> Note!
>
> Using components which are levereging [Portals](/#Portal) (Modal, Dialog, Tray, Position, Overlay, DrawerLayout) under the hood to render content is not recommended to use on the server side!
> If you must do so, please render them using Next.js's [dynamic](https://nextjs.org/docs/advanced-features/dynamic-import#with-no-ssr) feature with `ssr` set to false.

- in your Next.js application create - if it does not already exist - a file named `_app.js` inside the `pages` directory. This is a special file in Next.js because it allows you to override/control component initialization. Read more about it in the [Next.js docs](https://nextjs.org/docs/advanced-features/custom-app).

- then configure the `_app.js` so your component tree is wrapped with an `InstUISettingsProvider`
- the important step is to call `generateInstanceCounterMap` on every request, so the server side instance tracking and browser side instance tracking stays in sync with each other:

```js
---
render: false
example: false
---
//pages/_app.js
import React from 'react';
import Head from 'next/head';
import { InstUISettingsProvider } from "@instructure/emotion"
import { generateInstanceCounterMap } from '@instructure/ui-react-utils'

export default function MyApp(props) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
                                               {/* This is the important step */}
      <InstUISettingsProvider instanceCounterMap={generateInstanceCounterMap()}>
        <Component {...pageProps} />
      </InstUISettingsProvider>
    </>
  );
}
```

That is it! You should be ready to go!

#### Notes explaining what is going on with the above code

Keeping track of instances is a way we achieve deterministic `id` generation for components. Since components are being rendered on 2 places (server - client), it is crucial to have the same `ids` attached to the same instances on both the client and server sides.

To achieve deterministic `id` generation InstUI will keep track of every component instance internally, and will use this information to generate `ids` deterministically.