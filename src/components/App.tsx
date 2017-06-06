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

import React from "react"
import { BrowserRouter as Router, Route, Link } from "react-router-dom"

import BoxField from "./BoxField"
import ModeButton from "./ModeButton"

import styles from "./App.css"

import ThumbSVG from "../assets/thumb-right.svg"
import CarSVG from "../assets/car-side.svg"

export default function App() {
  return (
    <Router>
      <div className={styles.app}>
        <header className={styles.header}>
          <form className={styles.headerForm} action="/search" method="get">
            <BoxField type="submit" value="Request a ride" />
            <div className={styles.modeSwitch}>
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
            render={() => <p>Rides...</p>}
          />
          <Route path="/me" render={() => <p>Me</p>} />
        </main>
      </div>
    </Router>
  )
}
