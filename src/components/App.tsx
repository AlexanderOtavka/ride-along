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
import {
  Route,
  withRouter,
  RouteComponentProps,
  matchPath,
} from "react-router-dom"

import RideListHeader from "./RideListHeader"
import Nav from "./Nav"

import styles from "./App.sass"

interface OwnProps {}

type Props = RouteComponentProps<{}> & OwnProps

function App({ location }: Props) {
  const ridesMatch = matchPath(location.pathname, {
    path: "/(search)?",
    exact: true,
  })

  return (
    <div className={styles.app}>
      <Route exact path="/(search)?" component={RideListHeader} />

      <Nav
        ridesPath={ridesMatch ? location.pathname : "/"}
        profilePath="/users/me"
        feedbackPath="/feedback"
        isTipsHidden={false}
      />

      <main>
        <Route exact path="/(search)?" render={() => <p>Rides...</p>} />
        <Route path="/me" render={() => <p>Me</p>} />
      </main>
    </div>
  )
}

export default withRouter<OwnProps>(App)
