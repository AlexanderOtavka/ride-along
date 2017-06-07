/**
 * @file BoxField.test.tsx
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
import { Form } from "react-form"

import BoxField from "./BoxField"

describe("BoxField", () => {
  it("without optional props", () => {
    const component = reactTestRender(
      <Form>
        <BoxField field="foo" />
      </Form>
    )

    expect(component.toJSON()).toMatchSnapshot()
  })

  it("with className", () => {
    const component = reactTestRender(
      <Form>
        <BoxField field="foo" className="foo" />
      </Form>
    )

    expect(component.toJSON()).toMatchSnapshot()
  })

  it("with placeholder", () => {
    const component = reactTestRender(
      <Form>
        <BoxField field="foo" placeholder="foo" />
      </Form>
    )

    expect(component.toJSON()).toMatchSnapshot()
  })

  it("when it is a button", () => {
    const component = reactTestRender(
      <Form>
        <BoxField isButton field="foo" className="foo" />
      </Form>
    )

    expect(component.toJSON()).toMatchSnapshot()
  })
})
