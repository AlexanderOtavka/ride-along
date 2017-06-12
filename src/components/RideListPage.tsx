/**
 * @file RideListPage.tsx
 *
 * Created by Zander Otavka on 6/9/17.
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
import { RouteComponentProps } from "react-router-dom"
import { Button } from "react-toolbox/lib/button"
import classnames from "classnames"
import querystring from "querystring"

import RideListHeader from "./RideListHeader"
import Nav from "./Nav"
import RideListItem from "./RideListItem"

import styles from "./RideListPage.sass"

import exampleRides from "../constants/exampleRides"

interface MatchParams {
  0: "search" | undefined
}

export interface Props extends RouteComponentProps<MatchParams> {}

function RideListPage(props: Props) {
  const isSearchMode = !!props.match.params[0]
  const mode =
    (querystring.parse(props.location.search.substring(1)).mode as string) ||
    "request"

  return (
    <div className={classnames(styles.page, styles[mode])}>
      <RideListHeader {...props} isSearchMode={isSearchMode} />

      <main
        className={classnames(styles.list, isSearchMode && styles.isSearchMode)}
      >
        {exampleRides.map(ride => <RideListItem key={ride.uri} {...ride} />)}

        <footer>
          <p className={styles.listFooterText}>
            Don't see what you're looking for?
          </p>
          <Button className={styles.addRideButton}>Add Ride</Button>
        </footer>
      </main>

      <footer className={styles.navFooter}>
        <Nav ridesPath={location.pathname} />
      </footer>
    </div>
  )
}

export default RideListPage
