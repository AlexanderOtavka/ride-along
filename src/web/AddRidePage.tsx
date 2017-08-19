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
import { Form, FormField } from "react-form"
import { connect as connectRedux, DispatchProp } from "react-redux"
import { compose } from "redux"
import subDays from "date-fns/sub_days"

import Nav from "./Nav"
import RideVertical from "./RideVertical"
import DropdownField from "./DropdownField"
import DateTimeField from "./DateTimeField"

import connectQuery, { QueryComponentProps } from "../controllers/connectQuery"
import watchProp from "../controllers/watchProp"

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

function AddRidePage({
  query,
  departSuggestions,
  arriveSuggestions,
  dispatch,
  ...props,
}: AllProps) {
  const hasDepartSuggestions = departSuggestions && departSuggestions.length > 0
  const hasArriveSuggestions = arriveSuggestions && arriveSuggestions.length > 0

  const dateTimeTheme = {
    dialog: classnames(styles.dateTimeDialog, styles[query.mode]),
  }

  const backURI =
    query.arriveSearch !== undefined || query.departSearch !== undefined
      ? routes.ridesList.search(query)
      : routes.ridesList.root(query.mode)

  return (
    <Form
      component={false}
      values={props.draft}
      onChange={({ values }: any) => {
        dispatch(ridesActions.updateDraft(values))
      }}
      onSubmit={(values: any) => {
        dispatch(ridesActions.create.started(values))
        props.history.push(routes.ride.detail("lastCreated"))
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
            <Link to={backURI}>
              <IconButton icon={<BackSVG className={styles.backIcon} />} />
            </Link>

            <span className={styles.headerTitle}>New Ride</span>

            {/* TODO: validate, and don't let them create if it's wrong */}
            {hasDepartSuggestions &&
              hasArriveSuggestions &&
              <Button className={styles.createButton} type="submit">
                Create
              </Button>}
          </header>

          {hasDepartSuggestions && hasArriveSuggestions
            ? <main className={styles.main}>
                <RideVertical
                  departLocation={
                    // TODO: customize suggestion display with template
                    <DropdownField
                      field="departLocation"
                      source={departSuggestions.map(suggestionToDropdownItem)}
                    />
                  }
                  departDateTime={
                    <DateTimeField
                      field="departDateTime"
                      datePickerProps={{
                        minDate: subDays(new Date(), 1),
                        theme: dateTimeTheme,
                      }}
                      timePickerProps={{ theme: dateTimeTheme }}
                    />
                  }
                  arriveLocation={
                    <DropdownField
                      field="arriveLocation"
                      source={arriveSuggestions.map(suggestionToDropdownItem)}
                    />
                  }
                  arriveDateTime={
                    <DateTimeField
                      field="arriveDateTime"
                      datePickerProps={{
                        minDate: subDays(
                          props.draft.departDateTime || new Date(),
                          1
                        ),
                        theme: dateTimeTheme,
                      }}
                      timePickerProps={{ theme: dateTimeTheme }}
                    />
                  }
                />
                <div className={styles.extraFields}>
                  <FormField field="seatTotal">
                    {({ getValue, setValue, setTouched }: any) =>
                      <label className={styles.seatCount}>
                        <input
                          className={styles.seatCountInput}
                          type="number"
                          placeholder="#"
                          value={getValue() || ""}
                          onChange={ev =>
                            setValue(+ev.currentTarget.value || 0)}
                          onFocus={ev => ev.currentTarget.select()}
                          onBlur={() => setTouched()}
                        />
                        <p className={styles.seatCountLabel}>
                          {query.mode === "request" ? "Rider" : "Seat"}
                          {getValue() !== 1 && "s"}
                        </p>
                      </label>}
                  </FormField>
                  {/* TODO: add notification preferences */}
                  {/* TODO: add easy round trip creation */}
                </div>
              </main>
            : <main className={styles.main}>
                <RideVertical
                  departLocation={query.departSearch || ""}
                  departDateTime=""
                  arriveLocation={query.arriveSearch || ""}
                  arriveDateTime=""
                />

                <section className={styles.errorPanel}>
                  <h1 className={styles.errorPanelHeading}>Can't add ride!</h1>
                  <p className={styles.errorPanelText}>
                    We couldn't find any matches on Google Maps for your
                    {!hasDepartSuggestions && " departure location "}
                    {!(hasDepartSuggestions || hasArriveSuggestions) && " or "}
                    {!hasArriveSuggestions && " destination "}
                    search.
                  </p>
                  <p className={styles.errorPanelText}>
                    Make sure you spelled the address or search correctly.
                  </p>
                  <Link to={backURI}>
                    <Button>Back to Search</Button>
                  </Link>
                </section>
              </main>}

          <footer className={styles.footer}>
            <Nav />
          </footer>
        </form>}
    </Form>
  )
}

export default withController(AddRidePage)
