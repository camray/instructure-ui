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

/** @jsx jsx */
import { Component } from 'react'

import { View } from '@instructure/ui-view'
import { passthroughProps } from '@instructure/ui-react-utils'
import { Transition } from '@instructure/ui-motion'

import { withStyle, jsx } from '@instructure/emotion'

import generateStyle from './styles'
import generateComponentTheme from './theme'
import type { TabsPanelProps } from './props'
import { allowedProps, propTypes } from './props'

/**
---
parent: Tabs
id: Tabs.Panel
---
@tsProps
**/
@withStyle(generateStyle, generateComponentTheme)
class Panel extends Component<TabsPanelProps> {
  static readonly componentId = 'Tabs.Panel'

  static allowedProps = allowedProps
  static propTypes = propTypes

  static defaultProps = {
    isDisabled: false,
    textAlign: 'start',
    variant: 'default',
    isSelected: false,
    padding: 'small'
  }

  componentDidMount() {
    this.props.makeStyles?.()
  }

  componentDidUpdate() {
    this.props.makeStyles?.()
  }

  ref: HTMLDivElement | null = null

  handleRef = (el: HTMLDivElement | null) => {
    const { elementRef } = this.props

    this.ref = el

    if (typeof elementRef === 'function') {
      elementRef(el)
    }
  }

  render() {
    const {
      labelledBy,
      variant,
      id,
      maxHeight,
      minHeight,
      padding,
      textAlign,
      children,
      elementRef,
      isDisabled,
      isSelected,
      styles,
      ...props
    } = this.props
    const isHidden = !isSelected || !!isDisabled

    return (
      <div
        {...passthroughProps(props)}
        css={styles?.panel}
        role="tabpanel"
        id={id}
        aria-labelledby={labelledBy}
        aria-hidden={isHidden ? 'true' : undefined}
        ref={this.handleRef}
      >
        <Transition
          type="fade"
          in={!isHidden}
          unmountOnExit
          transitionExit={false}
        >
          <View
            css={styles?.content}
            maxHeight={maxHeight}
            minHeight={minHeight}
            as="div"
            padding={padding}
            textAlign={textAlign}
          >
            {children}
          </View>
        </Transition>
      </div>
    )
  }
}

export default Panel
export { Panel }
