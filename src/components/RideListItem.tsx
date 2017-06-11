/**
 * @file RideListItem.tsx
 *
 * Created by Zander Otavka on 6/11/17.
 * Copyright (C) 2016  Grinnell AppDev.
 *
 * @license
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React from "react"
import { Link } from "react-router-dom"
import ripple, { RippleTheme } from "react-toolbox/lib/ripple/Ripple"
import classnames from "classnames"

import Ride, { Props as RideProps } from "./Ride"

import rippleTheme from "react-toolbox/lib/ripple/theme.css"
import styles from "./RideListItem.sass"

export interface Props extends RideProps {
  uri: string
  isLast?: boolean
  theme?: RippleTheme
  children?: React.ReactNode
  onMouseDown?: React.EventHandler<React.MouseEvent<any>>
  onTouchStart?: React.EventHandler<React.TouchEvent<any>>
}

const withRipple = ripple({
  spread: 0.5,
  theme: {
    ...rippleTheme,
    rippleWrapper: classnames(styles.rippleWrapper, rippleTheme.rippleWrapper),
  },
})

function RideListItem({
  uri,
  isLast = false,
  theme,
  children,
  onMouseDown,
  onTouchStart,
  ...props,
}: Props) {
  return (
    <li className={classnames(styles.listItem, isLast && styles.last)}>
      <Link
        to={uri}
        className={styles.link}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <Ride {...props} />

        {children}
      </Link>
    </li>
  )
}

export default withRipple(RideListItem)
