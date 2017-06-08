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
  Link,
  NavLink,
  withRouter,
  RouteComponentProps,
  matchPath,
} from "react-router-dom"
import { IconButton } from "react-toolbox/lib/button"
import { IconMenu, MenuItem } from "react-toolbox/lib/menu"

import RideListHeader from "./RideListHeader"

import styles from "./App.sass"

import CarSVG from "../drawables/car-side.svg"
import AccountSVG from "../drawables/account-circle.svg"
import DotsSVG from "../drawables/dots-horizontal.svg"

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

      <nav className={styles.nav}>
        <NavLink
          exact
          to={ridesMatch ? location.pathname : "/"}
          className={styles.navLink}
          activeClassName={styles.active}
          title="Rides"
        >
          <IconButton
            className={styles.navButton}
            icon={<CarSVG className={styles.navIcon} />}
          />
        </NavLink>

        <NavLink
          to="/me"
          className={styles.navLink}
          activeClassName={styles.active}
          title="Rides"
        >
          <IconButton
            className={styles.navButton}
            icon={<AccountSVG className={styles.navIcon} />}
          />
        </NavLink>

        <IconMenu
          className={styles.navLink}
          theme={{ icon: styles.navButton }}
          icon={<DotsSVG className={styles.navIcon} />}
        >
          <Link to="?hideTips=true"><MenuItem caption="Hide Tips" /></Link>
          <Link to="/feedback"><MenuItem caption="Feedback" /></Link>
        </IconMenu>
      </nav>

      <main>
        <Route exact path="/(search)?" render={() => <p>Rides...</p>} />
        <Route path="/me" render={() => <p>Me</p>} />
      </main>
    </div>
  )
}

export default withRouter<OwnProps>(App)
