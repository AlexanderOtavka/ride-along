/**
 * @file DateTimeField.tsx
 *
 * Created by Zander Otavka on 8/16/17.
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
import DateTime from "react-datetime"
import classnames from "classnames"

import styles from "./DateTimeField.sass"

export interface Props {
  field: string
  queryMode: "request" | "offer"
}

function DateTimeField(props: Props) {
  return (
    <FormField field={props.field}>
      {({ getValue, setValue, setTouched }: any) => (
        <div className={classnames(styles.fieldset, styles[props.queryMode])}>
          <DateTime
            value={getValue()}
            onChange={moment => setValue(new Date(+moment.valueOf()))}
          />
        </div>
      )}
    </FormField>
  )
}

export default DateTimeField
