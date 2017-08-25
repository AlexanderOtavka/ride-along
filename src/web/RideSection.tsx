/**
 * @file RideSection.tsx
 *
 * Created by Zander Otavka on 8/9/17.
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
import classnames from "classnames"

import styles from "./RideSection.sass"

export interface Props {
  icon: React.ReactChild
  location: React.ReactChild
  dateTime: React.ReactChild
  className?: string
}

function RideSection(props: Props) {
  return (
    <section className={classnames(styles.section, props.className)}>
      <div className={styles.iconCircle}>
        {props.icon}
      </div>
      <div className={styles.text}>
        <h2 className={styles.location}>
          {props.location}
        </h2>
        <div className={styles.dateTime}>
          {props.dateTime}
        </div>
      </div>
    </section>
  )
}

export default RideSection
