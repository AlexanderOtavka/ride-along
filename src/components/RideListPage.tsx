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
import { connect, DispatchProp } from "react-redux"
import { RouteComponentProps } from "react-router-dom"
import { Button } from "react-toolbox/lib/button"
import classnames from "classnames"
import querystring from "querystring"

import RideListHeader from "./RideListHeader"
import Nav from "./Nav"
import RideListItem from "./RideListItem"

import { StateModel } from "../store"
import { RideModel, RideSearchModel, ridesActions } from "../store/rides"

import * as routes from "../constants/routes"

import styles from "./RideListPage.sass"

interface MatchParams {
  0: "search" | undefined
}

interface StateProps {
  list: ReadonlyArray<RideModel>
}

interface DispatchProps extends DispatchProp<StateModel> {}

export interface Props extends RouteComponentProps<MatchParams> {}

type AllProps = Readonly<StateProps & DispatchProps & Props>

const withConnect = connect<
  StateProps,
  DispatchProps,
  Props
>((state: StateModel) => ({
  list: state.rides.list,
}))

function RideListPage({ dispatch, history, ...props }: AllProps) {
  const isSearchMode = !!props.match.params[0]

  const query: RideSearchModel = {
    mode: "request",
    ...querystring.parse(
      props.location.search.substring(1) // chop off the ?
    ),
  }

  const updateQuery = (values: RideSearchModel) => {
    history.replace("?" + querystring.stringify(values))
  }

  return (
    <div className={classnames(styles.page, styles[query.mode])}>
      <RideListHeader
        isSearchMode={isSearchMode}
        values={query}
        onSearchModeChange={(newIsSearchMode, newValues) => {
          if (newIsSearchMode) {
            history.push(routes.rides.search)
            updateQuery(newValues)
          } else {
            history.goBack()
          }
        }}
        onValuesChange={values => {
          dispatch(ridesActions.search(values))
          updateQuery(values)
        }}
      />

      <main
        className={classnames(styles.main, isSearchMode && styles.isSearchMode)}
      >
        <ul className={styles.list}>
          {props.list.map(({ uid, ...ride }, i) =>
            <RideListItem
              {...ride}
              key={uid}
              uri={routes.rides.ride(uid)}
              isLast={i === props.list.length - 1}
            />
          )}
        </ul>

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

export default withConnect(RideListPage)
