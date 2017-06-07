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
import classnames from "classnames"

import styles from "./BoxField.sass"

interface Props extends React.HTMLProps<HTMLInputElement> {
  isButton?: boolean
  field: string
}

export default function BoxField({
  field,
  isButton = false,
  className,
  placeholder,
  value,
  ...props,
}: Props) {
  const classes = classnames(styles.boxField, className)

  return isButton
    ? <input {...props} className={classes} type="submit" value={placeholder} />
    : <FormField field={field}>
        {({ getValue, setValue, setTouched }: any) =>
          <input
            {...props}
            className={classes}
            placeholder={placeholder}
            value={getValue("")}
            onChange={ev => setValue(ev.target.value)}
            onBlur={ev => setTouched()}
          />}
      </FormField>
}
