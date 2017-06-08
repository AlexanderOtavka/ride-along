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

import React from "react"
import { Radio } from "react-form"
import classnames from "classnames"

import styles from "./ModeButton.sass"

import ThumbSVG from "../drawables/thumb-right.svg"
import CarSVG from "../drawables/car-side.svg"

interface ModeButtonProps {
  mode: "request" | "offer"
}

export default function ModeButton({ mode }: ModeButtonProps) {
  const isRequestMode = mode === "request"

  return (
    <label
      className={styles.modeButton}
      title={isRequestMode ? "Request rides" : "Offer rides"}
    >
      <Radio className={styles.input} value={mode} />

      <div className={classnames(styles.button, styles[mode])}>
        {isRequestMode ? <ThumbSVG /> : <CarSVG />}
      </div>
    </label>
  )
}
