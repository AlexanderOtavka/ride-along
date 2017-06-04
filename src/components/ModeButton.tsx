/**
 * @file ModeButton.tsx
 *
 * Created by Zander Otavka on 6/3/17.
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

import * as React from "react"

import bemHelper from "../util/bemHelper"
import "./ModeButton.css"

interface ModeButtonProps {
  name: string
  mode: string
  defaultChecked?: boolean
  imageSrc: string
}

const bem = bemHelper("ModeButton")

export default function ModeButton({
  mode,
  defaultChecked = false,
  ...props,
}: ModeButtonProps) {
  return (
    <label className={bem("")}>
      <input
        className={bem("input")}
        type="radio"
        name={props.name}
        value={mode}
        defaultChecked={defaultChecked}
      />

      <div className={bem("button", mode)}>
        <img className={bem("image", mode)} src={props.imageSrc} />
      </div>
    </label>
  )
}
