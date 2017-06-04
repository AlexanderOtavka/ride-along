/**
 * @file App.tsx
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

import * as React from "react"
import { BrowserRouter as Router, Route, Link } from "react-router-dom"

import BoxField from "./BoxField"
import ModeButton from "./ModeButton"

import bemHelper from "../util/bemHelper"
import "./App.css"

import ThumbSVG from "!!react-svg-loader?es5!../assets/thumb-right.svg"
import CarSVG from "!!react-svg-loader?es5!../assets/car-side.svg"

const bem = bemHelper("App")

export default function App() {
  return (
    <Router>
      <div className={bem()}>
        <header className={bem("header")}>
          <form className={bem("header-form")} action="/search" method="get">
            <BoxField type="submit" value="Request a ride" />
            <div className={bem("mode-switch")}>
              <ModeButton
                name="mode"
                mode="request"
                defaultChecked={true}
                image={<ThumbSVG />}
              />
              <ModeButton name="mode" mode="offer" image={<CarSVG />} />
            </div>
          </form>
        </header>

        <nav>
          <Link to="/">Rides</Link>
          <Link to="/me">Me</Link>
          <button>Options</button>
        </nav>

        <main>
          <Route
            exact={true}
            path="/(:?search)?"
            render={() => <span>"Rides..."</span>}
          />
          <Route path="/me" render={() => <span>"Me"</span>} />
        </main>
      </div>
    </Router>
  )
}
