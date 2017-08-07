/**
 * @file index.tsx
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
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"

import App from "./components/App"

import configureStore, { Dependencies as StoreDependencies } from "./store"

import registerServiceWorker from "./registerServiceWorker"

import "./index.sass"

declare namespace window {
  export let onPlacesAPILoad: () => void
}

const store = configureStore()
const deps: StoreDependencies = {
  placesPromise: new Promise(resolve => {
    if (google.maps.places) {
      resolve(google.maps.places)
    } else {
      window.onPlacesAPILoad = () => resolve(google.maps.places)
    }
  }),
}

store.runPersistentSaga(deps)
registerServiceWorker()

render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
)
