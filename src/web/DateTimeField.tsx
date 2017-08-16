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

import { formatDateLong } from "../util/format"

import styles from "./DateTimeField.sass"

export interface Props {
  field: string
  datePickerProps?: Partial<DatePickerProps>
  timePickerProps?: Partial<TimePickerProps>
}

const sharedPickerTheme = {
  input: styles.input,
  inputElement: styles.inputElement,
}

function DateTimeField(props: Props) {
  return (
    <FormField field={props.field}>
      {({ getValue, setValue }: any) =>
        <div className={styles.fieldset}>
          <DatePicker
            {...props.datePickerProps}
            value={getValue()}
            onChange={setValue}
            sundayFirstDayOfWeek={true}
            inputFormat={formatDateLong}
            theme={sharedPickerTheme}
          />
          <TimePicker
            {...props.timePickerProps}
            value={getValue()}
            onChange={setValue}
            format="ampm"
            theme={sharedPickerTheme}
          />
        </div>}
    </FormField>
  )
}

export default DateTimeField
