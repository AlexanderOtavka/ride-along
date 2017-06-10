/**
 * @file Nav.tsx
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
import { Link, NavLink } from "react-router-dom"
import { IconButton } from "react-toolbox/lib/button"
import { IconMenu, MenuItem } from "react-toolbox/lib/menu"

import routes from "../constants/routes"

import styles from "./Nav.sass"

import CarSVG from "../drawables/car-side.svg"
import AccountSVG from "../drawables/account-circle.svg"
import DotsSVG from "../drawables/dots-horizontal.svg"

interface Props {
  ridesPath?: string
  profilePath?: string
  feedbackPath?: string
}

export default function Nav({
  ridesPath = routes.rides.root,
  profilePath = routes.profile.root,
  feedbackPath = routes.feedback,
}: Props) {
  const isTipsHidden = false

  return (
    <nav className={styles.nav}>
      <NavLink
        exact
        to={ridesPath}
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
        to={profilePath}
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
        <MenuItem caption={isTipsHidden ? "Show Tips" : "Hide Tips"} />
        <Link to={feedbackPath}><MenuItem caption="Feedback" /></Link>
      </IconMenu>
    </nav>
  )
}
