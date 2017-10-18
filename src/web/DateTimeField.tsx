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
import { DatePicker, DatePickerProps } from "react-toolbox/lib/date_picker"
import { TimePicker, TimePickerProps } from "react-toolbox/lib/time_picker"
import mergeWith from "lodash/mergeWith"
import classnames from "classnames"

import { formatDateLong } from "../util/format"

import styles from "./DateTimeField.sass"

export interface Props {
  field: string
  datePickerProps?: Partial<DatePickerProps>
  timePickerProps?: Partial<TimePickerProps>
}

function mergeClassNames(objValue: any, sourceValue: any) {
  return typeof objValue === "string" && typeof sourceValue === "string"
    ? classnames(objValue, sourceValue)
    : undefined
}

function DateTimeField({ datePickerProps, timePickerProps, ...props }: Props) {
  const sharedTheme = {
    input: styles.input,
    inputElement: styles.inputElement,
  }

  const dateTheme = mergeWith(
    {},
    sharedTheme,
    datePickerProps && datePickerProps.theme,
    mergeClassNames
  )

  const timeTheme = mergeWith(
    {
      hand: styles.hand,
      knob: styles.knob,
    },
    sharedTheme,
    timePickerProps && timePickerProps.theme,
    mergeClassNames
  )

  return (
    <FormField field={props.field}>
      {({ getValue, setValue, setTouched }: any) => (
        <div className={styles.fieldset}>
          <DatePicker
            {...datePickerProps}
            value={getValue()}
            onChange={setValue}
            sundayFirstDayOfWeek={true}
            inputFormat={formatDateLong}
            theme={dateTheme}
            {...{ onBlur: () => setTouched() }} // TODO: fix when onBlur gets added to typedefs
          />
          <TimePicker
            {...timePickerProps}
            value={getValue()}
            onChange={setValue}
            format="ampm"
            theme={timeTheme}
            onBlur={() => setTouched()}
          />
        </div>
      )}
    </FormField>
  )
}

export default DateTimeField
