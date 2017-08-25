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
import { asyncComponent } from "react-async-component"

import * as routes from "../constants/routes"

import styles from "./App.sass"

export interface Props {
  poweredByGoogleNode?: HTMLDivElement
}

const RideListPage = asyncComponent({
  resolve: () =>
    import(/* webpackChunkName: "RideListPage" */ "./RideListPage"),
})

const RideDetailPage = asyncComponent({
  resolve: () =>
    import(/* webpackChunkName: "RideDetailPage" */ "./RideDetailPage"),
})

const AddRidePage = asyncComponent({
  resolve: () => import(/* webpackChunkName: "AddRidePage" */ "./AddRidePage"),
})

const Nav = asyncComponent({
  resolve: () => import(/* webpackChunkName: "Nav" */ "./Nav"),
})

function App(props: Props) {
  return (
    <div
      className={styles.app}
      ref={el => {
        if (el && props.poweredByGoogleNode) {
          // TODO: make this actually show
          el.appendChild(props.poweredByGoogleNode)
        }
      }}
    >
      <Switch>
        <Route
          exact
          path={routes.ridesList.matchPath}
          component={RideListPage}
        />
        <Route exact path={routes.ride.new()} component={AddRidePage} />
        <Route
          exact
          path={routes.ride.detail(":id")}
          component={RideDetailPage}
        />
        <Route render={() => <Nav />} />
      </Switch>
    </div>
  )
}

export default App
