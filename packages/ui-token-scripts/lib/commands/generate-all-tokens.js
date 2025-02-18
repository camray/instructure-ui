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

import loadConfig from '@instructure/config-loader'
import { getCommand, runCommandsConcurrently } from '@instructure/command-utils'

export default {
  command: 'generate-all-tokens',
  describe:
    'Generate cross-platform design tokens for all themes in configuration.',
  handler: (argv) => {
    const config = loadConfig('ui-token-scripts')
    const commandsToRun = config.reduce(
      (commands, { themeKey, sourceTokens, outputPackage, groupOutput }) => {
        return {
          ...commands,
          [`${themeKey} - ${outputPackage}`]: getCommand('ui-token-scripts', [
            'generate-tokens',
            '-s',
            sourceTokens,
            '-t',
            themeKey,
            '-p',
            outputPackage,
            '-g',
            groupOutput === true
          ])
        }
      },
      {}
    )
    runCommandsConcurrently(commandsToRun)
  }
}
