/**
 * @file AddRidePage.tsx
 *
 * Created by Zander Otavka on 8/7/17.
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
import { Link } from "react-router-dom"
import { Button, IconButton } from "react-toolbox/lib/button"
import classnames from "classnames"
import { Form } from "react-form"
import { connect as connectRedux, DispatchProp } from "react-redux"
import { compose } from "redux"

import Nav from "./Nav"
import RideVertical from "./RideVertical"
import DropdownField from "./DropdownField"

import connectQuery, { QueryComponentProps } from "../controllers/connectQuery"
import watchProp from "../controllers/watchProp"

import { formatDateLong, formatTime } from "../util/format"
import { pickSearch } from "../util/pick"

import { StateModel } from "../store"
import { ridesActions, RideSearchModel, RideModel } from "../store/rides"

import * as routes from "../constants/routes"

import styles from "./AddRidePage.sass"

import BackSVG from "../drawables/arrow-left.svg"

type Query = RideSearchModel

interface StateProps {
  departSuggestions: ReadonlyArray<google.maps.places.PlaceResult>
  arriveSuggestions: ReadonlyArray<google.maps.places.PlaceResult>
  draft: Partial<RideModel>
}

interface DispatchProps extends DispatchProp<StateModel> {}

export interface Props extends QueryComponentProps<{}, Query> {}

type AllProps = Readonly<StateProps & DispatchProps & Props>

const withController = compose(
  connectQuery(pickSearch),
  connectRedux<StateProps, DispatchProps, Props>(({ rides }: StateModel) => ({
    departSuggestions: rides.departSuggestions,
    arriveSuggestions: rides.arriveSuggestions,
    draft: rides.draft,
  })),
  watchProp<AllProps, Query>(
    props => props.query,
    (query, oldQuery, { dispatch }) => {
      dispatch(ridesActions.search.started(query))
    }
  )
)

function suggestionToDropdownItem(suggestion: google.maps.places.PlaceResult) {
  return {
    value: suggestion.place_id,
    label: suggestion.name,
  }
}

const dropdownTheme = {
  inputBox: styles.dropdownInputBox,
  valueKey: "",
}

function AddRidePage({
  query,
  departSuggestions,
  arriveSuggestions,
  dispatch,
  ...props,
}: AllProps) {
  const arriveDateObj = new Date()
  const departDateObj = new Date()

  const hasDepartSuggestions = departSuggestions && departSuggestions.length > 0
  const hasArriveSuggestions = arriveSuggestions && arriveSuggestions.length > 0

  return (
    <Form
      component={false}
      values={props.draft}
      onChange={({ values }: any) => {
        dispatch(ridesActions.updateDraft(values))
      }}
    >
      {({ submitForm }: any) =>
        <form
          className={classnames(styles.page, styles[query.mode])}
          action={routes.ride.root}
          method="post"
          onSubmit={ev => {
            ev.preventDefault()
            submitForm()
          }}
        >
          <header className={styles.header}>
            <Link
              to={
                query.arriveSearch !== undefined ||
                query.departSearch !== undefined
                  ? routes.ridesList.search(query)
                  : routes.ridesList.root(query.mode)
              }
            >
              <IconButton icon={<BackSVG className={styles.backIcon} />} />
            </Link>

            <span className={styles.headerTitle}>New Ride</span>

            <Button className={styles.createButton} type="submit">
              Create
            </Button>
          </header>

          {hasDepartSuggestions && hasArriveSuggestions
            ? <main className={styles.main}>
                <RideVertical
                  departLocation={
                    <DropdownField
                      field="departLocation"
                      source={departSuggestions.map(suggestionToDropdownItem)}
                      theme={dropdownTheme}
                    />
                  }
                  departDateTime={
                    formatDateLong(arriveDateObj) +
                    ", " +
                    formatTime(arriveDateObj)
                  }
                  arriveLocation={
                    <DropdownField
                      field="arriveLocation"
                      source={arriveSuggestions.map(suggestionToDropdownItem)}
                      theme={dropdownTheme}
                    />
                  }
                  arriveDateTime={
                    formatDateLong(departDateObj) +
                    ", " +
                    formatTime(departDateObj)
                  }
                />
              </main>
            : <main className={styles.main}>
                {/* TODO: make this look nicer */}
                <h1>Error</h1>
                {!hasDepartSuggestions && <div>No depart suggestions</div>}
                {!hasArriveSuggestions && <div>No arrive suggestions</div>}
              </main>}

          <footer className={styles.footer}>
            <Nav />
          </footer>
        </form>}
    </Form>
  )
}

export default withController(AddRidePage)
