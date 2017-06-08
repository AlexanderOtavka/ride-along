/**
 * @file Nav.test.tsx
 *
 * Created by Zander Otavka on 6/7/17.
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

import Nav from "./Nav"

function itWhenAtURL(description: string, url: string) {
  it(description, () => {
    const component = reactTestRender(
      <MemoryRouter initialEntries={[url]}>
        <Nav
          ridesPath="/rides"
          profilePath="/profile"
          feedbackPath="/feedback"
          isTipsHidden={false}
        />
      </MemoryRouter>
    )

    expect(component.toJSON()).toMatchSnapshot()
  })
}

describe("Nav", () => {
  itWhenAtURL("without a path match", "/")

  describe("with a path match", () => {
    itWhenAtURL("for rides", "/rides")
    itWhenAtURL("for profile", "/profile")
    itWhenAtURL("for feedback", "/feedback")
  })

  describe("with only a sub-path match", () => {
    itWhenAtURL("for rides", "/rides/foo")
    itWhenAtURL("for profile", "/profile/foo")
    itWhenAtURL("for feedback", "/feedback/foo")
  })

  it("when tips are hidden", () => {
    const component = reactTestRender(
      <MemoryRouter initialEntries={["/rides"]}>
        <Nav
          ridesPath="/rides"
          profilePath="/profile"
          feedbackPath="/feedback"
          isTipsHidden={true}
        />
      </MemoryRouter>
    )

    expect(component.toJSON()).toMatchSnapshot()
  })
})
