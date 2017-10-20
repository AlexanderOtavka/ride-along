/**
 * @file test.ts
 *
 * Created by Zander Otavka on 8/16/17.
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

import {
  getDefaultLocation,
  ridesReducer,
  RidesModel,
  ridesActions,
  RideModel,
} from "./rides"

describe("getDefaultLocation", () => {
  const SUGGESTIONS: any[] = [
    {
      place_id: "foo",
    },
    {
      place_id: "bar",
    },
  ]

  it("returns empty string without suggestions or currentLocation", () => {
    expect(getDefaultLocation([])).toBe("")
    expect(getDefaultLocation(null)).toBe("")
  })

  it("returns the current location without suggestions", () => {
    expect(getDefaultLocation([], "foo")).toBe("foo")
    expect(getDefaultLocation(null, "foo")).toBe("foo")
  })

  it("picks the first suggestion without a current location", () => {
    expect(getDefaultLocation(SUGGESTIONS)).toBe("foo")
  })

  it("picks the first suggestion when current location isn't in suggestion list", () => {
    expect(getDefaultLocation(SUGGESTIONS, "baz")).toBe("foo")
  })

  it("keeps the current location when it is in suggestions", () => {
    expect(getDefaultLocation(SUGGESTIONS, "foo")).toBe("foo")
    expect(getDefaultLocation(SUGGESTIONS, "bar")).toBe("bar")
  })
})

describe("ridesReducer", () => {
  const STATE: RidesModel = {
    locations: {},
    list: [],
    isSearching: false,
    departSuggestions: [],
    arriveSuggestions: [],
    isCreating: false,
    lastCreated: null,
    draft: {
      mode: "request",
      departLocation: "",
      departDateTime: new Date(2017, 1, 1),
      arriveLocation: "",
      arriveDateTime: new Date(2017, 1, 1),
      seatTotal: 0,
    },
  }

  const RIDE: RideModel = {
    id: "foo",
    mode: "request",
    departLocation: "bar",
    departDateTime: new Date(2017, 1, 1),
    arriveLocation: "baz",
    arriveDateTime: new Date(2017, 1, 1),
    seatTotal: 3,
  }

  describe("with receive action", () => {
    it("replaces its list with the new one", () => {
      // TODO: think about using snapshots
      expect(ridesReducer(STATE, ridesActions.receive(RIDE))).toEqual({
        ...STATE,
        list: [RIDE],
      })
    })
  })

  describe("with update draft action", () => {
    it("when seat total is out of bounds", () => {
      expect(
        ridesReducer(
          STATE,
          ridesActions.updateDraft({ ...STATE.draft, seatTotal: 1000 })
        )
      ).toEqual({
        ...STATE,
        draft: {
          ...STATE.draft,
          seatTotal: 99,
        },
      })

      expect(
        ridesReducer(
          STATE,
          ridesActions.updateDraft({ ...STATE.draft, seatTotal: -10 })
        )
      ).toEqual({
        ...STATE,
        draft: {
          ...STATE.draft,
          seatTotal: 0,
        },
      })
    })
  })
})
