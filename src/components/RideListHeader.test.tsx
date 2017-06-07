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
import { mount as enzymeRender } from "enzyme"
import { matchPath } from "react-router-dom"
import { createMemoryHistory } from "history"

import RideListHeader from "./RideListHeader"

function getRouteMocks(url: string) {
  const history = createMemoryHistory({ initialEntries: [url] })
  const { location } = history
  const match = matchPath<{ 0: "search" | undefined }>(location.pathname, {
    path: "/(search)?",
    exact: true,
  })

  if (match === null) {
    throw TypeError(`Invalid url. Must match path. Got "${url}"`)
  }

  return { history, location, match }
}

function itWhenAtURL(url: string) {
  it(`when at ${url}`, () => {
    const component = reactTestRender(
      <RideListHeader {...getRouteMocks(url)} />
    )

    expect(component.toJSON()).toMatchSnapshot()
  })
}

describe("RideListHandler", () => {
  itWhenAtURL("/")
  itWhenAtURL("/?departlocation=foo&arrivelocation=bar")
  itWhenAtURL("/?mode=request")
  itWhenAtURL("/?mode=offer")
  itWhenAtURL("/search")
  itWhenAtURL("/search?mode=request")
  itWhenAtURL("/search?mode=offer")
  itWhenAtURL("/search?mode=offer&departLocation=foo&arriveLocation=bar")
  itWhenAtURL("/search?mode=request&departLocation=foo")
  itWhenAtURL("/search?mode=offer&arriveLocation=bar")

  it("switches to search when form is submitted", () => {
    const routeMocks = getRouteMocks("/")
    const component = enzymeRender(<RideListHeader {...routeMocks} />)

    component.find("form").simulate("submit")

    const { history } = routeMocks
    expect(history.location.pathname).toBe("/search")
    expect(history.location.search).toBe("?mode=request")
    expect(history.action).toBe("REPLACE")
  })
})
