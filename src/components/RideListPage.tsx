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
import classnames from "classnames"

import RideListHeader from "./RideListHeader"
import Nav from "./Nav"
import RideListItem from "./RideListItem"

import styles from "./RideListPage.sass"

interface MatchParams {
  0: "search" | undefined
}

export interface Props extends RouteComponentProps<MatchParams> {}

function RideListPage(props: Props) {
  const isSearchMode = !!props.match.params[0]

  return (
    <div className={styles.page}>
      <RideListHeader {...props} isSearchMode={isSearchMode} />

      <main
        className={classnames(styles.list, isSearchMode && styles.isSearchMode)}
      >
        <RideListItem
          uri="/rides/foo"
          departureLocation="Grinnell College"
          departureDateTime={new Date()}
          arrivalLocation="Walmart"
          arrivalDateTime={new Date()}
        />
        <RideListItem
          uri="/rides/foo"
          departureLocation="Grinnell College"
          departureDateTime={new Date()}
          arrivalLocation="Walmart"
          arrivalDateTime={new Date()}
        />
        <RideListItem
          uri="/rides/foo"
          departureLocation="Grinnell College"
          departureDateTime={new Date()}
          arrivalLocation="Walmart"
          arrivalDateTime={new Date()}
        />
        <RideListItem
          uri="/rides/foo"
          departureLocation="Grinnell College"
          departureDateTime={new Date()}
          arrivalLocation="Walmart"
          arrivalDateTime={new Date()}
        />
        <RideListItem
          uri="/rides/foo"
          departureLocation="Grinnell College"
          departureDateTime={new Date()}
          arrivalLocation="Walmart"
          arrivalDateTime={new Date()}
        />
        <RideListItem
          uri="/rides/foo"
          departureLocation="O'Hare International Airport"
          departureDateTime={new Date()}
          arrivalLocation="Grinnell College"
          arrivalDateTime={new Date()}
          isLast={true}
        />
      </main>

      <footer className={styles.navFooter}>
        <Nav ridesPath={location.pathname} />
      </footer>
    </div>
  )
}

export default RideListPage
