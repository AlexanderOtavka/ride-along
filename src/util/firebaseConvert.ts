/**
 * @file firebaseConvert.ts
 *
 * Created by Zander Otavka on 8/17/17.
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

import isPlainObject from "lodash/isPlainObject"
import mapValues from "lodash/mapValues"

export function toFirebase(value: any): any {
  if (
    typeof value === "number" ||
    typeof value === "string" ||
    typeof value === "undefined" ||
    typeof value === "boolean" ||
    value === null
  ) {
    return value
  }

  if (value instanceof Date) {
    return { __type: "Date", value: value.valueOf() }
  }

  if (Array.isArray(value)) {
    return value.map(toFirebase)
  }

  if (isPlainObject(value)) {
    return mapValues(value, toFirebase)
  }

  console.warn("Couldn't convert value:", value)
  return value
}

export function fromFirebase(value: any): any {
  if (
    typeof value === "number" ||
    typeof value === "string" ||
    typeof value === "undefined" ||
    typeof value === "boolean" ||
    value === null
  ) {
    return value
  }

  if (value && value.__type === "Date") {
    return new Date(value.value)
  }

  if (Array.isArray(value)) {
    return value.map(fromFirebase)
  }

  if (isPlainObject(value)) {
    return mapValues(value, fromFirebase)
  }

  console.warn("Couldn't convert value:", value)
  return value
}
