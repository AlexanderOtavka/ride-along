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

export interface Props extends React.HTMLProps<HTMLInputElement> {
  field: string
  type?: "text" | "date" | "submit"
  theme?: RippleTheme
  rootProps?: React.HTMLProps<HTMLDivElement>
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
  type = "text",
  rootProps,
  placeholder,
  value,
  theme,
  children,
  onMouseDown,
  onTouchStart,
  ...props,
}: Props) {
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

  // Autofocus is broken in preact for some reason, so we have to do this hack
  const autofocusRefHandler = (el: HTMLInputElement) => {
    if (el && props.autoFocus) {
      el.focus()
    }
  }

  return (
    <div
      {...rootProps}
      className={classnames(styles.boxField, rootProps && rootProps.className)}
    >
      {type === "submit" ? (
        <input
          {...props}
          ref={autofocusRefHandler}
          className={classnames(styles.input, props.className)}
          type="submit"
          value={placeholder}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        />
      ) : (
        <FormField field={field}>
          {({ getValue, setValue, setTouched }: any) => (
            <input
              {...props}
              ref={autofocusRefHandler}
              type={type}
              className={classnames(styles.input, props.className)}
              placeholder={placeholder}
              value={getValue("")}
              onChange={ev => {
                setValue(ev.currentTarget.value)
                if (props.onChange) {
                  props.onChange(ev)
                }
              }}
              onBlur={ev => {
                setTouched()
                if (props.onBlur) {
                  props.onBlur(ev)
                }
              }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            />
          )}
        </FormField>
      )}
      <div className={styles.backdrop} />
      {children}
    </div>
  )
}

export default withRipple(BoxField)
