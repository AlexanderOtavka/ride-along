/**
 * @file firebaseConvert.test.ts
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

import { toFirebase, fromFirebase } from "./firebaseConvert"

describe("toFirebase", () => {
  it("doesn't change primitives", () => {
    expect(toFirebase(null)).toBe(null)
    expect(toFirebase(undefined)).toBe(undefined)
    expect(toFirebase(false)).toBe(false)
    expect(toFirebase(7.3)).toBe(7.3)
    expect(toFirebase("foo")).toBe("foo")
  })

  it("converts Dates to a plain object", () => {
    const dateValue = 3842374023
    expect(toFirebase(new Date(dateValue))).toEqual({
      __type: "Date",
      value: dateValue,
    })
  })

  it("maps over objects", () => {
    const obj = { foo: 2, bar: "barval", baz: undefined }
    expect(toFirebase(obj)).toEqual({ foo: 2, bar: "barval", baz: undefined })
    expect(toFirebase(obj)).not.toBe(obj)
  })

  it("maps over arrays", () => {
    const arr = [1, "zing", false, null]
    expect(toFirebase(arr)).toEqual([1, "zing", false, null])
    expect(toFirebase(arr)).not.toBe(arr)
  })

  it("complains and doesn't handle functions", () => {
    console.warn = jest.fn()
    const func = () => null
    expect(toFirebase(func)).toBe(func)
    expect(console.warn).toBeCalled()
  })
})

describe("fromFirebase", () => {
  it("doesn't change primitives", () => {
    expect(fromFirebase(null)).toBe(null)
    expect(fromFirebase(undefined)).toBe(undefined)
    expect(fromFirebase(false)).toBe(false)
    expect(fromFirebase(7.3)).toBe(7.3)
    expect(fromFirebase("foo")).toBe("foo")
  })

  it("converts objects with __type: 'Date' to Date objects", () => {
    const dateValue = 3842374023
    expect(
      fromFirebase({
        __type: "Date",
        value: dateValue,
      })
    ).toEqual(new Date(dateValue))
  })

  it("maps over objects", () => {
    const obj = { foo: 2, bar: "barval", baz: undefined }
    expect(fromFirebase(obj)).toEqual({ foo: 2, bar: "barval", baz: undefined })
    expect(fromFirebase(obj)).not.toBe(obj)
  })

  it("maps over arrays", () => {
    const arr = [1, "zing", false, null]
    expect(fromFirebase(arr)).toEqual([1, "zing", false, null])
    expect(fromFirebase(arr)).not.toBe(arr)
  })

  it("complains and doesn't handle functions", () => {
    const warn = console.warn

    console.warn = jest.fn()
    const func = () => null
    expect(fromFirebase(func)).toBe(func)
    expect(console.warn).toBeCalled()

    console.warn = warn
  })
})
