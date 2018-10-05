/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 - present Instructure, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

module.exports = {
  files: [
    'packages/**/*.test.js'
  ],
  ignore: [
    'packages/ui-codemods/**'
  ],
  // TODO convert these to use ui-test-utils and then remove them:
  TESTBED_REMOVE_THIS: [
    'packages/generate-examples/',
    'packages/media-capture/',
    'packages/ui-a11y/',
    'packages/ui-alerts/',
    'packages/ui-code-editor/',
    'packages/ui-container/',
    'packages/ui-core/',
    'packages/ui-elements/',
    'packages/ui-focusable/',
    'packages/ui-forms/',
    'packages/ui-i18n/',
    'packages/ui-layout/',
    'packages/ui-media-player/',
    'packages/ui-menu/',
    'packages/ui-motion/',
    'packages/ui-navigation/',
    'packages/ui-overlays/',
    'packages/ui-pages/',
    'packages/ui-pagination/',
    'packages/ui-tabs/',
    'packages/ui-themeable/',
    'packages/ui-themes/',
    'packages/ui-toggle-details/',
    'packages/ui-tree-browser/',
    'packages/ui-utils/'
  ]
}
