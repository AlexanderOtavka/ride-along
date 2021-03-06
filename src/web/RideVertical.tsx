/**
 * @file RideVertical.tsx
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

import RideSection from "./RideSection"

import styles from "./RideVertical.sass"

import MapMarkerSVG from "../drawables/map-marker.svg"
import DownChevronSVG from "../drawables/down-chevron.svg"

export interface Props {
  departLocation: React.ReactChild
  departDateTime: React.ReactChild
  departIcon?: React.ReactChild
  arriveLocation: React.ReactChild
  arriveDateTime: React.ReactChild
  arriveIcon?: React.ReactChild
}

function RideVertical({
  departIcon = <MapMarkerSVG />,
  arriveIcon = <MapMarkerSVG />,
  ...props
}: Props) {
  return (
    <article className={styles.ride}>
      <RideSection
        className={styles.depart}
        icon={departIcon}
        location={props.departLocation}
        dateTime={props.departDateTime}
      />

      <DownChevronSVG className={styles.downChevron} />

      <RideSection
        icon={arriveIcon}
        location={props.arriveLocation}
        dateTime={props.arriveDateTime}
      />
    </article>
  )
}

export default RideVertical
