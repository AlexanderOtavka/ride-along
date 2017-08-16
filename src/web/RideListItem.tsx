/**
 * @file RideListItem.tsx
 *
 * Created by Zander Otavka on 6/11/17.
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
import { Link } from "react-router-dom"
import classnames from "classnames"

import RideSection from "./RideSection"

import { formatDateShort, formatTime } from "../util/format"

import styles from "./RideListItem.sass"

import RightChevronSVG from "../drawables/right-chevron.svg"
import MapMarkerSVG from "../drawables/map-marker.svg"

export interface Props {
  uri: string
  departLocation: string
  departDateTime: Date
  arriveLocation: string
  arriveDateTime: Date
  isLast?: boolean
}

function RideListItem({ uri, isLast = false, ...props }: Props) {
  const departureDate = formatDateShort(props.departDateTime)
  const departureTime = formatTime(props.departDateTime)
  const departureDateTime = `${departureDate} ${departureTime}`

  const arrivalDate = formatDateShort(props.arriveDateTime)
  const arrivalTime = formatTime(props.arriveDateTime)
  const arrivalDateTime =
    departureDate === arrivalDate
      ? arrivalTime
      : `${arrivalDate} ${arrivalTime}`

  return (
    <li className={classnames(styles.listItem, isLast && styles.last)}>
      <Link to={uri} className={styles.link}>
        <article className={styles.ride}>
          <RideSection
            className={styles.departure}
            icon={<MapMarkerSVG />}
            location={props.departLocation}
            dateTime={departureDateTime}
          />
          <RightChevronSVG className={styles.rightChevron} />
          <RideSection
            className={styles.arrival}
            icon={<MapMarkerSVG />}
            location={props.arriveLocation}
            dateTime={arrivalDateTime}
          />
        </article>
      </Link>
    </li>
  )
}

export default RideListItem
