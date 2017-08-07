/**
 * @file Ride.tsx
 *
 * Created by Zander Otavka on 6/10/17.
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
import leftPad from "left-pad"

import styles from "./Ride.sass"

import MapMarkerSVG from "../drawables/map-marker.svg"
import RightChevronSVG from "../drawables/right-chevron.svg"

export interface Props {
  departureLocation: string
  departureDateTime: Date
  arrivalLocation: string
  arrivalDateTime: Date
}

function formatDate(date: Date) {
  const month = date.getMonth() + 1
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

function Ride(props: Props) {
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
    <article className={styles.ride}>
      <section className={styles.departure}>
        <div className={styles.iconCircle}>
          <MapMarkerSVG className={styles.icon} />
        </div>
        <div className={styles.text}>
          <h2 className={styles.location}>
            {props.departureLocation}
          </h2>
          <p className={styles.dateTime}>
            {departureDateTime}
          </p>
        </div>
      </section>

      <RightChevronSVG className={styles.rightChevron} />

      <section className={styles.arrival}>
        <div className={styles.iconCircle}>
          <MapMarkerSVG className={styles.icon} />
        </div>
        <div className={styles.text}>
          <h2 className={styles.location}>
            {props.arrivalLocation}
          </h2>
          <p className={styles.dateTime}>
            {arrivalDateTime}
          </p>
        </div>
      </section>
    </article>
  )
}

export default Ride
