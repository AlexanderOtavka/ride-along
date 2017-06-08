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
import { mount as enzymeMount } from "enzyme"
import { Router, matchPath } from "react-router-dom"
import { createMemoryHistory } from "history"

import RideListHeader from "./RideListHeader"

function getRouteMocks(url: string) {
  const history = createMemoryHistory({ initialEntries: [url] })
  const { location } = history
  const match = matchPath<{ 0: "search" | undefined }>(location.pathname, {
    path: "/(search)?",
    exact: true,
  })

  if (!match) {
    throw TypeError(`Invalid url. Must match path. Got "${url}"`)
  }

  return { history, location, match }
}

function itWhenAtURL(url: string) {
  it(`when at ${url}`, () => {
    const routeMocks = getRouteMocks(url)
    const component = reactTestRender(
      <Router history={routeMocks.history}>
        <RideListHeader {...routeMocks} />
      </Router>
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
    const { history } = routeMocks
    const component = enzymeMount(
      <Router history={history}>
        <RideListHeader {...routeMocks} />
      </Router>
    )

    component.find("form").simulate("submit")
    expect(history.location.pathname).toBe("/search")
    expect(history.location.search).toBe("?mode=request")
    expect(history.length).toBe(2)
  })

  describe("mode switch", () => {
    const routeMocks = getRouteMocks("/")
    const { history } = routeMocks
    const component = enzymeMount(
      <Router history={history}>
        <RideListHeader {...routeMocks} />
      </Router>
    )

    it("starts out with request selected", () => {
      expect(history.location.pathname).toBe("/")
      expect(history.location.search).toBe("?mode=request")
      expect(history.length).toBe(1)
    })

    it("switches to offer mode", () => {
      component.find("ModeButton").last().find("input").simulate("click")
      expect(history.location.pathname).toBe("/")
      expect(history.location.search).toBe("?mode=offer")
      expect(history.length).toBe(1)
    })

    it("stays in offer mode when clicked again", () => {
      component.find("ModeButton").last().find("input").simulate("click")
      expect(history.location.pathname).toBe("/")
      expect(history.location.search).toBe("?mode=offer")
      expect(history.length).toBe(1)
    })

    it("switches back to request mode", () => {
      component.find("ModeButton").first().find("input").simulate("click")
      expect(history.location.pathname).toBe("/")
      expect(history.location.search).toBe("?mode=request")
      expect(history.length).toBe(1)
    })
  })

  describe("search box", () => {
    it("changes the url when depart search box changes", () => {
      const routeMocks = getRouteMocks("/search")
      const { history } = routeMocks
      const component = enzymeMount(
        <Router history={history}>
          <RideListHeader {...routeMocks} />
        </Router>
      )

      component
        .find("BoxField")
        .first()
        .find("input")
        .simulate("change", { target: { value: "foo" } })

      expect(history.location.pathname).toBe("/search")
      expect(history.location.search).toBe("?mode=request&departLocation=foo")
      expect(history.length).toBe(1)
    })

    it("changes the url when arrive search box changes", () => {
      const routeMocks = getRouteMocks("/search")
      const { history } = routeMocks
      const component = enzymeMount(
        <Router history={history}>
          <RideListHeader {...routeMocks} />
        </Router>
      )

      component
        .find("BoxField")
        .last()
        .find("input")
        .simulate("change", { target: { value: "bar" } })

      expect(history.location.pathname).toBe("/search")
      expect(history.location.search).toBe("?mode=request&arriveLocation=bar")
      expect(history.length).toBe(1)
    })
  })
})
