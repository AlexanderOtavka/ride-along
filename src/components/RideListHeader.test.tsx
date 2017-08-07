/**
 * @file RideListHeader.test.tsx
 *
 * Created by Zander Otavka on 6/6/17.
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
import { create as reactTestRender } from "react-test-renderer"
import { MemoryRouter } from "react-router-dom"

import RideListHeader from "./RideListHeader"

import { RideSearchModel } from "../store/rides"

function itWithProps(isSearchMode: boolean, values: RideSearchModel) {
  it(`with values=${JSON.stringify(values)}`, () => {
    const component = reactTestRender(
      <MemoryRouter>
        <RideListHeader
          isSearchMode={isSearchMode}
          values={values}
          onSearchModeChange={() => undefined}
          onValuesChange={() => undefined}
          onDepartBoxChange={() => undefined}
          onDepartBoxBlur={() => undefined}
          onArriveBoxChange={() => undefined}
          onArriveBoxBlur={() => undefined}
        />
      </MemoryRouter>
    )

    expect(component.toJSON()).toMatchSnapshot()
  })
}

describe("RideListHandler", () => {
  describe("when not in search mode", () => {
    itWithProps(false, { mode: "request" })
    itWithProps(false, { mode: "offer" })
    itWithProps(false, {
      mode: "request",
      departLocation: "foo",
      arriveLocation: "bar",
    })
  })

  describe("when in search mode", () => {
    itWithProps(true, { mode: "request" })
    itWithProps(true, { mode: "offer" })
    itWithProps(true, {
      mode: "offer",
      departLocation: "foo",
      arriveLocation: "bar",
    })
    itWithProps(true, { mode: "request", departLocation: "foo" })
    itWithProps(true, { mode: "offer", arriveLocation: "bar" })
  })
})
