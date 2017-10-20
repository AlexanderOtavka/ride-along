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
import DateTime, { DatetimepickerProps } from "react-datetime"
import classnames from "classnames"
import { isMoment } from "moment"

import styles from "./DateTimeField.sass"

export interface Props extends DatetimepickerProps {
  field: string
  queryMode: "request" | "offer"
}

function DateTimeField({ field, queryMode, ...pickerProps }: Props) {
  return (
    <FormField field={field}>
      {({ getValue, setValue, setTouched }: any) => (
        <div className={classnames(styles.fieldset, styles[queryMode])}>
          <DateTime
            timeConstraints={{
              minutes: { min: 0, max: 59, step: 10 },
            }}
            {...pickerProps}
            value={getValue()}
            onChange={value => {
              if (isMoment(value)) {
                setValue(value.toDate())
              }
            }}
            onBlur={() => setTouched()}
          />
        </div>
      )}
    </FormField>
  )
}

export default DateTimeField
