/**
 * @file App.test.tsx
 *
 * Created by Zander Otavka on 6/2/17.
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
import { render } from "react-dom"
import { MemoryRouter } from "react-router-dom"
import { Provider } from "react-redux"

import App from "./App"

import configureStore from "../store"

it("renders without crashing", () => {
  const div = document.createElement("div")
  const store = configureStore({
    placesServicePromise: Promise.resolve<any>({}),
    autocompleteServicePromise: Promise.resolve<any>({}),
    placesServiceStatusPromise: Promise.resolve<any>({}),
    ridesListRefPromise: Promise.resolve<any>({}),
  })

  render(
    <Provider store={store}>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </Provider>,
    div
  )
})
