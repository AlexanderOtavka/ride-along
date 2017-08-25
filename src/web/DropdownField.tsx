/**
 * @file DropdownField.tsx
 *
 * Created by Zander Otavka on 8/12/17.
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
import { Dropdown, DropdownProps } from "react-toolbox/lib/dropdown"
import mapValues from "lodash/mapValues"
import classnames from "classnames"

import styles from "./DropdownField.sass"

export interface Props extends DropdownProps {
  field: string
}

function DropdownField({ theme, field, ...props }: Props) {
  return (
    <FormField field={field}>
      {({ getValue, setValue, setTouched }: any) =>
        <Dropdown
          {...props}
          value={getValue()}
          onChange={setValue}
          onBlur={() => setTouched()}
          theme={{
            valueKey: "", // TODO: remove this once the typedefs update
            ...theme,
            ...mapValues(
              {
                dropdown: styles.dropdown,
                values: styles.values,
                inputInput: styles.input,
                inputInputElement: styles.inputElement,
              },
              (classname, key) => classnames(classname, theme && theme[key])
            ),
          }}
        />}
    </FormField>
  )
}

export default DropdownField
