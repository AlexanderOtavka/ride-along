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
import { connect as connectRedux, DispatchProp } from "react-redux"
import { Link, RouteComponentProps } from "react-router-dom"
import { Button } from "react-toolbox/lib/button"
import classnames from "classnames"
import { compose } from "redux"

import RideListHeader from "./RideListHeader"
import Nav from "./Nav"
import RideListItem from "./RideListItem"

import connectQuery, { QueryComponentProps } from "../controllers/connectQuery"

import { pickSearch } from "../util/pick"

import { StateModel } from "../store"
import { RideModel, RideSearchModel, ridesActions } from "../store/rides"
import {
  AutocompletePredictionModel,
  autocompleteActions,
} from "../store/autocomplete"

import * as routes from "../constants/routes"
import * as ids from "../constants/ids"

import styles from "./RideListPage.sass"

type RouteParams = ["search" | undefined]

interface StateProps {
  rideList: ReadonlyArray<RideModel>
  autocompleteList: ReadonlyArray<AutocompletePredictionModel>
  autocompleteField: string
  hasDepartSearchSuggestions: boolean
  hasArriveSearchSuggestions: boolean
}

interface DispatchProps extends DispatchProp<StateModel> {}

export interface Props extends RouteComponentProps<RouteParams> {}

interface SubProps
  extends Props,
    QueryComponentProps<RouteParams, RideSearchModel> {}

type AllProps = StateProps & DispatchProps & SubProps

const withController = compose(
  connectQuery(pickSearch),
  connectRedux<
    StateProps,
    DispatchProps,
    SubProps
  >((state: StateModel, props) => ({
    rideList: state.rides.list,
    autocompleteList: state.autocomplete.list,
    autocompleteField: state.autocomplete.field,
    hasDepartSearchSuggestions:
      !props ||
      !props.query.departSearch ||
      (state.rides.departSuggestions &&
        state.rides.departSuggestions.length > 0),
    hasArriveSearchSuggestions:
      !props ||
      !props.query.arriveSearch ||
      (state.rides.arriveSuggestions &&
        state.rides.arriveSuggestions.length > 0),
  }))
)

function RideListPage({
  dispatch,
  history,
  query,
  setQuery,
  hasDepartSearchSuggestions,
  hasArriveSearchSuggestions,
  ...props,
}: AllProps) {
  const isSearchMode = !!props.match.params[0]

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
          dispatch(ridesActions.search.started(values))
          setQuery(values)
        }}
        onDepartBoxChange={search =>
          dispatch(
            autocompleteActions.getList.started({
              field: "departSearch",
              search,
            })
          )}
        onDepartBoxBlur={() =>
          requestAnimationFrame(() => dispatch(autocompleteActions.cancel({})))}
        onArriveBoxChange={search =>
          dispatch(
            autocompleteActions.getList.started({
              field: "arriveSearch",
              search,
            })
          )}
        onArriveBoxBlur={() =>
          requestAnimationFrame(() => dispatch(autocompleteActions.cancel({})))}
      />

      <main
        className={classnames(styles.main, isSearchMode && styles.isSearchMode)}
      >
        {/* TODO: fix autocomplete on desktop */}
        {/* TODO: improve autocomplete acessibility */}
        <ul
          className={styles.autocompleteList}
          hidden={props.autocompleteList.length === 0}
        >
          {props.autocompleteList.map(({ description, ...prediction }) =>
            <li
              key={prediction.place_id || description}
              className={styles.autocompleteItem}
              onClick={() => {
                setQuery({
                  ...query,
                  [props.autocompleteField]: description,
                })
              }}
            >
              {description}
            </li>
          )}
        </ul>

        <section className={styles.rideListWrapper}>
          <ul className={styles.rideList}>
            {props.rideList.map(({ id, ...ride }, i) =>
              <RideListItem
                {...ride}
                key={id}
                uri={routes.ride.detail(id)}
                isLast={i === props.rideList.length - 1}
              />
            )}
          </ul>

          {hasDepartSearchSuggestions && hasArriveSearchSuggestions
            ? <footer>
                <p className={styles.listFooterText}>
                  Don't see what you're looking for?
                </p>

                {!query.departSearch
                  ? <Button
                      className={styles.listFooterButton}
                      onClick={() => {
                        document.getElementById(
                          ids.RIDE_DEPART_SEARCH_INPUT
                        )!.focus()
                      }}
                    >
                      Add Departure Location
                    </Button>
                  : !query.arriveSearch
                    ? <Button
                        className={styles.listFooterButton}
                        onClick={() => {
                          document.getElementById(
                            ids.RIDE_ARRIVE_SEARCH_INPUT
                          )!.focus()
                        }}
                      >
                        Add Destination
                      </Button>
                    : <Link
                        to={routes.ride.new(query)}
                        onClick={() => {
                          dispatch(
                            ridesActions.resetDraft({ date: new Date() })
                          )
                        }}
                      >
                        <Button className={styles.listFooterButton}>
                          Create Ride Listing
                        </Button>
                      </Link>}
              </footer>
            : <footer>
                <p className={styles.listFooterText}>
                  We couldn't find any matches on Google Maps for your
                  {!hasDepartSearchSuggestions && " departure location "}
                  {!(
                    hasDepartSearchSuggestions || hasArriveSearchSuggestions
                  ) && " or "}
                  {!hasArriveSearchSuggestions && " destination "}
                  search.
                </p>
                <p className={styles.listFooterText}>
                  Make sure you spelled the address or search correctly.
                </p>

                {!hasDepartSearchSuggestions
                  ? <Button
                      className={styles.listFooterButton}
                      onClick={() => {
                        const input = document.getElementById(
                          ids.RIDE_DEPART_SEARCH_INPUT
                        ) as HTMLInputElement

                        input.select()
                      }}
                    >
                      Edit Departure Location
                    </Button>
                  : <Button
                      className={styles.listFooterButton}
                      onClick={() => {
                        const input = document.getElementById(
                          ids.RIDE_ARRIVE_SEARCH_INPUT
                        ) as HTMLInputElement

                        input.select()
                      }}
                    >
                      Edit Destination
                    </Button>}
              </footer>}
        </section>
      </main>

      <footer className={styles.navFooter}>
        <Nav ridesPath={props.location.pathname} />
      </footer>
    </div>
  )
}

export default withController(RideListPage)
