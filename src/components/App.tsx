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
import { Route, Switch } from "react-router-dom"

import RideListPage from "./RideListPage"
import Nav from "./Nav"

import styles from "./App.sass"

export interface Props {}

function App(props: Props) {
  return (
    <div className={styles.app}>
      <Switch>
        <Route exact path="/(search)?" component={RideListPage} />
        <Route
          render={() =>
            <Nav ridesPath="/" profilePath="/me" feedbackPath="/feedback" />}
        />
      </Switch>
    </div>
  )
}

export default App
