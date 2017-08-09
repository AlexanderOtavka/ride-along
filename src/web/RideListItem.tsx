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
import leftPad from "left-pad"

import RideSection from "./RideSection"

import styles from "./RideListItem.sass"

import RightChevronSVG from "../drawables/right-chevron.svg"
import MapMarkerSVG from "../drawables/map-marker.svg"

export interface Props {
  uri: string
  departureLocation: string
  departureDateTime: Date
  arrivalLocation: string
  arrivalDateTime: Date
  isLast?: boolean
}

function formatDate(date: Date) {
  const month = date.getMonth() + 1 // Date.getMonth() starts counting at 0
  if (date.getFullYear() !== new Date().getFullYear()) {
    return `${month}/${date.getDate()}/${date.getFullYear()}`
  } else {
    return `${month}/${date.getDate()}`
  }
}

function formatTime(date: Date) {
  const hours = date.getHours() % 12 || 12
  const minutes = leftPad(date.getMinutes(), 2, "0")
  const amPM = date.getHours() < 12 ? "AM" : "PM"
  return `${hours}:${minutes} ${amPM}`
}

function RideListItem({ uri, isLast = false, ...props }: Props) {
  const departureDate = formatDate(props.departureDateTime)
  const departureTime = formatTime(props.departureDateTime)
  const departureDateTime = `${departureDate} ${departureTime}`

  const arrivalDate = formatDate(props.arrivalDateTime)
  const arrivalTime = formatTime(props.arrivalDateTime)
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
            location={props.departureLocation}
            dateTime={departureDateTime}
          />
          <RightChevronSVG className={styles.rightChevron} />
          <RideSection
            className={styles.arrival}
            icon={<MapMarkerSVG />}
            location={props.arrivalLocation}
            dateTime={arrivalDateTime}
          />
        </article>
      </Link>
    </li>
  )
}

export default RideListItem
