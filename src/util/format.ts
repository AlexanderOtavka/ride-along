/**
 * @file format.ts
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

import leftPad from "left-pad"

export function formatDateShort(date: Date) {
  const month = date.getMonth() + 1 // Date.getMonth() starts counting at 0
  const dateOfYear = `${month}/${date.getDate()}`
  if (date.getFullYear() !== new Date().getFullYear()) {
    return `${dateOfYear}/${date.getFullYear()}`
  } else {
    return dateOfYear
  }
}

export function formatDateLong(date: Date) {
  const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const month = MONTH_NAMES[date.getMonth()]

  const dateLastDigit = date.getDate() % 10
  const dateSuffix =
    dateLastDigit === 1
      ? "st"
      : dateLastDigit === 2 ? "nd" : dateLastDigit === 3 ? "rd" : "th"

  const dateOfYear = `${month} ${date.getDate()}${dateSuffix}`

  if (date.getFullYear() !== new Date().getFullYear()) {
    return `${dateOfYear}, ${date.getFullYear()}`
  } else {
    return dateOfYear
  }
}

export function formatTime(date: Date) {
  const hours = date.getHours() % 12 || 12
  const minutes = leftPad(date.getMinutes(), 2, "0")
  const amPM = date.getHours() < 12 ? "AM" : "PM"
  return `${hours}:${minutes} ${amPM}`
}
