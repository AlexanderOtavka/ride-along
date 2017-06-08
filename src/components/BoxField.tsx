/**
 * @file BoxField.tsx
 *
 * Created by Zander Otavka on 6/4/17.
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
import { FormField } from "react-form"
import ripple, { RippleTheme } from "react-toolbox/lib/ripple/Ripple"
import classnames from "classnames"

import rippleTheme from "react-toolbox/lib/ripple/theme.css"
import styles from "./BoxField.sass"

interface Props extends React.HTMLProps<HTMLInputElement> {
  isButton?: boolean
  field: string
  theme?: RippleTheme
}

const withRipple = ripple({
  theme: {
    ...rippleTheme,
    ripple: classnames(styles.ripple, rippleTheme.ripple),
    rippleWrapper: classnames(styles.rippleWrapper, rippleTheme.rippleWrapper),
  },
})

function BoxField({
  field,
  isButton = false,
  className,
  placeholder,
  value,
  theme,
  children,
  onMouseDown,
  onTouchStart,
  ...props,
}: Props) {
  const classes = classnames(styles.input, className)
  const handleMouseDown = (ev: React.MouseEvent<HTMLInputElement>) => {
    if (onMouseDown && document.activeElement !== ev.currentTarget) {
      onMouseDown(ev)
    }
  }

  const handleTouchStart = (ev: React.TouchEvent<HTMLInputElement>) => {
    if (onTouchStart && document.activeElement !== ev.currentTarget) {
      onTouchStart(ev)
    }
  }

  return (
    <div className={styles.boxField}>
      {isButton
        ? <input
            {...props}
            className={classes}
            type="submit"
            value={placeholder}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          />
        : <FormField field={field}>
            {({ getValue, setValue, setTouched }: any) =>
              <input
                {...props}
                className={classes}
                placeholder={placeholder}
                value={getValue("")}
                onChange={ev => setValue(ev.target.value)}
                onBlur={ev => setTouched()}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
              />}
          </FormField>}
      <div className={styles.backdrop} />
      {children}
    </div>
  )
}

export default withRipple(BoxField)
