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
import { Link, RouteComponentProps } from "react-router-dom"
import { Button } from "react-toolbox/lib/button"
import classnames from "classnames"
import querystring from "querystring"

import RideListHeader from "./RideListHeader"
import Nav from "./Nav"
import RideListItem from "./RideListItem"

import { StateModel } from "../store"
import { RideModel, RideSearchModel, ridesActions } from "../store/rides"
import {
  AutocompletePredictionModel,
  autocompleteActions,
} from "../store/autocomplete"

import * as routes from "../constants/routes"

import styles from "./RideListPage.sass"

interface MatchParams {
  0: "search" | undefined
}

interface StateProps {
  rideList: ReadonlyArray<RideModel>
  autocompleteList: ReadonlyArray<AutocompletePredictionModel>
  autocompleteField: string
}

interface DispatchProps extends DispatchProp<StateModel> {}

export interface Props extends RouteComponentProps<MatchParams> {}

type AllProps = Readonly<StateProps & DispatchProps & Props>

const withConnect = connect<
  StateProps,
  DispatchProps,
  Props
>((state: StateModel) => ({
  rideList: state.rides.list,
  autocompleteList: state.autocomplete.list,
  autocompleteField: state.autocomplete.field,
}))

function RideListPage({ dispatch, history, ...props }: AllProps) {
  const isSearchMode = !!props.match.params[0]

  const query: RideSearchModel = {
    mode: "request",
    ...querystring.parse(
      props.location.search.substring(1) // chop off the leading ?
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
            history.push(routes.ridesList.search(newValues))
          } else {
            dispatch(ridesActions.cancelSearch({}))
            dispatch(autocompleteActions.cancel({}))
            history.push(routes.ridesList.root(newValues.mode))
          }
        }}
        onValuesChange={values => {
          dispatch(ridesActions.search(values))
          updateQuery(values)
        }}
        onDepartBoxChange={search =>
          dispatch(
            autocompleteActions.getList.started({
              field: "departLocation",
              search,
            })
          )}
        onDepartBoxBlur={() =>
          requestAnimationFrame(() => dispatch(autocompleteActions.cancel({})))}
        onArriveBoxChange={search =>
          dispatch(
            autocompleteActions.getList.started({
              field: "arriveLocation",
              search,
            })
          )}
        onArriveBoxBlur={() =>
          requestAnimationFrame(() => dispatch(autocompleteActions.cancel({})))}
      />

      <main
        className={classnames(styles.main, isSearchMode && styles.isSearchMode)}
      >
        <ul
          className={styles.autocompleteList}
          hidden={props.autocompleteList.length === 0}
        >
          {props.autocompleteList.map(({ description, ...prediction }) =>
            <li
              key={prediction.place_id || description}
              className={styles.autocompleteItem}
              onClick={() => {
                updateQuery({
                  ...query,
                  [props.autocompleteField]: description,
                })
              }}
            >
              {description}
            </li>
          )}
        </ul>

        <ul className={styles.rideList}>
          {props.rideList.map(({ uid, ...ride }, i) =>
            <RideListItem
              {...ride}
              key={uid}
              uri={routes.ride.detail(uid)}
              isLast={i === props.rideList.length - 1}
            />
          )}

          <footer>
            <p className={styles.listFooterText}>
              Don't see what you're looking for?
            </p>
            <Link to={routes.ride.new(query)}>
              <Button className={styles.addRideButton}>Add Ride</Button>
            </Link>
          </footer>
        </ul>
      </main>

      <footer className={styles.navFooter}>
        <Nav ridesPath={props.location.pathname} />
      </footer>
    </div>
  )
}

export default withConnect(RideListPage)
