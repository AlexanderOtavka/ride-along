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
import { Link, RouteComponentProps } from "react-router-dom"
import { Button, IconButton } from "react-toolbox/lib/button"
import classnames from "classnames"
import { Form, FormField } from "react-form"
import { connect as connectRedux, DispatchProp } from "react-redux"
import { compose } from "redux"
import moment, { Moment } from "moment"
import LoadingSpinner from "halogen/BounceLoader"

import Nav from "./Nav"
import RideVertical from "./RideVertical"
import DropdownField from "./DropdownField"
import DateTimeField from "./DateTimeField"

import connectQuery, { QueryComponentProps } from "../controllers/connectQuery"
import watchProp from "../controllers/watchProp"

import { pickSearch } from "../util/pick"

import { StateModel } from "../store"
import {
  ridesActions,
  RideSearchModel,
  LocationModel,
  DraftModel,
} from "../store/rides"

import * as routes from "../constants/routes"

import styles from "./AddRidePage.sass"

import BackSVG from "../drawables/arrow-left.svg"
import StopIconSVG from "../drawables/alert-octagon.svg"

type Query = RideSearchModel

interface StateProps {
  isSearching: boolean
  isCreating: boolean
  departSuggestions: ReadonlyArray<LocationModel>
  arriveSuggestions: ReadonlyArray<LocationModel>
  draft: DraftModel
}

interface DispatchProps extends DispatchProp<StateModel> {}

export interface Props extends QueryComponentProps<{}, Query> {}

interface SubProps extends QueryComponentProps<{}, Query> {}

type AllProps = Readonly<StateProps & DispatchProps & SubProps>

const withController = compose(
  connectQuery<Query, {}, RouteComponentProps<{}>>(query => pickSearch(query)),
  connectRedux<StateProps, DispatchProps, Props>(({ rides }: StateModel) => ({
    isSearching: rides.isSearching,
    isCreating: rides.isCreating,
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

function suggestionToDropdownItem(suggestion: LocationModel) {
  return {
    value: suggestion.place_id,
    label: suggestion.name,
  }
}

function getDraftError(draft: DraftModel) {
  if (draft.departDateTime < new Date()) {
    return "Departure time cannot be in the past"
  }

  if (draft.arriveDateTime < draft.departDateTime) {
    return "Arrival time must come after departure"
  }

  if (draft.seatTotal === 0) {
    const passengerQuantifier =
      draft.mode === "request" ? "riders" : "open seats"
    return `Must have one or more ${passengerQuantifier}`
  }

  return null
}

function AddRidePage({
  query,
  departSuggestions,
  arriveSuggestions,
  dispatch,
  ...props
}: AllProps) {
  const hasDepartSuggestions = departSuggestions && departSuggestions.length > 0
  const hasArriveSuggestions = arriveSuggestions && arriveSuggestions.length > 0

  const backURI =
    query.arriveSearch !== undefined || query.departSearch !== undefined
      ? routes.ridesList.search(query)
      : routes.ridesList.root(query.mode)

  const draftError = getDraftError(props.draft)

  return (
    <Form
      component={false}
      values={{ ...props.draft }}
      onChange={({ values }: any) => {
        dispatch(ridesActions.updateDraft(values))
      }}
      onSubmit={(values: any) => {
        dispatch(ridesActions.create.started(values))
      }}
    >
      {({ submitForm }: any) => (
        <form
          className={classnames(styles.page, styles[query.mode])}
          action={routes.ride.root}
          method="post"
          onSubmit={ev => {
            ev.preventDefault()
            submitForm()
          }}
        >
          <header className={styles.header} data-draft-error={draftError}>
            <Link to={backURI}>
              <IconButton icon={<BackSVG className={styles.backIcon} />} />
            </Link>

            <span className={styles.headerTitle}>New Ride</span>

            {props.isCreating ? (
              <LoadingSpinner
                className={styles.createLoadingSpinner}
                color="#fff"
              />
            ) : (
              <Button
                className={styles.createButton}
                type="submit"
                disabled={!!draftError}
              >
                {!!draftError && <StopIconSVG />}
                Create
              </Button>
            )}
          </header>

          {/* TODO: handle ride creation errors gracefully */}

          {hasDepartSuggestions && hasArriveSuggestions ? (
            <main className={styles.main}>
              <RideVertical
                // TODO: customize icons based on location classification
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
                    queryMode={query.mode}
                    isValidDate={(currentMoment: Moment) =>
                      currentMoment.isAfter(moment().subtract(1, "day"))
                    }
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
                    queryMode={query.mode}
                    viewMode="time"
                    isValidDate={(currentMoment: Moment) =>
                      currentMoment.isAfter(
                        moment(props.draft.departDateTime).subtract(1, "day")
                      )
                    }
                  />
                }
              />
              <div className={styles.extraFields}>
                <FormField field="seatTotal">
                  {({ getValue, setValue, setTouched }: any) => (
                    <label className={styles.seatCount}>
                      <input
                        className={styles.seatCountInput}
                        type="number"
                        placeholder="#"
                        value={getValue() || ""}
                        onChange={ev => setValue(+ev.currentTarget.value || 0)}
                        onFocus={ev => ev.currentTarget.select()}
                        onBlur={() => setTouched()}
                      />
                      <p className={styles.seatCountLabel}>
                        {query.mode === "request" ? "Rider" : "Seat"}
                        {getValue() !== 1 && "s"}
                      </p>
                    </label>
                  )}
                </FormField>
                {/* TODO: add price selector */}
                {/* TODO: add notification preferences */}
                {/* TODO: add easy round trip creation */}
              </div>
            </main>
          ) : (
            <main className={styles.main}>
              <RideVertical
                departLocation={query.departSearch || ""}
                departDateTime=""
                departIcon={
                  props.isSearching ? (
                    <LoadingSpinner className={styles.locationLoadingSpinner} />
                  ) : (
                    undefined
                  )
                }
                arriveLocation={query.arriveSearch || ""}
                arriveDateTime=""
                arriveIcon={
                  props.isSearching ? (
                    <LoadingSpinner className={styles.locationLoadingSpinner} />
                  ) : (
                    undefined
                  )
                }
              />

              {!props.isSearching && (
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
              )}
            </main>
          )}

          <footer className={styles.footer}>
            <Nav />
          </footer>
        </form>
      )}
    </Form>
  )
}

export default withController(AddRidePage)
