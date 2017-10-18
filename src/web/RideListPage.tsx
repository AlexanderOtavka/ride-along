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
import { Button, IconButton } from "react-toolbox/lib/button"
import classnames from "classnames"
import { compose } from "redux"
import Downshift from "downshift"
import { Form, RadioGroup } from "react-form"
import isEqual from "lodash/isEqual"

import Nav from "./Nav"
import RideListItem from "./RideListItem"
import BoxField from "./BoxField"
import ModeButton from "./ModeButton"

import connectQuery, { QueryComponentProps } from "../controllers/connectQuery"
import watchProp from "../controllers/watchProp"

import { pickSearch } from "../util/pick"

import { StateModel } from "../store"
import {
  RideModel,
  RideSearchModel,
  ridesActions,
  createGetRideSearchList,
} from "../store/rides"
import {
  AutocompletePredictionModel,
  autocompleteActions,
} from "../store/autocomplete"

import * as routes from "../constants/routes"
import * as ids from "../constants/ids"

import styles from "./RideListPage.sass"

import DownChevronSVG from "../drawables/down-chevron.svg"
import CloseSVG from "../drawables/close.svg"
import CurrentLocationSVG from "../drawables/crosshairs-gps.svg"

type RouteParams = ["search" | undefined]
type Query = RideSearchModel

interface StateProps {
  rideList: ReadonlyArray<RideModel>
  autocompleteList: ReadonlyArray<AutocompletePredictionModel>
  isSearching: boolean
  hasDepartSearchSuggestions: boolean
  hasArriveSearchSuggestions: boolean
}

interface DispatchProps extends DispatchProp<StateModel> {}

export interface Props extends RouteComponentProps<RouteParams> {}

interface SubProps extends Props, QueryComponentProps<RouteParams, Query> {}

type AllProps = StateProps & DispatchProps & SubProps

const withController = compose(
  connectQuery<Query, RouteParams, Props>((query, { match }) =>
    pickSearch(query, !!match.params[0])
  ),
  connectRedux<StateProps, DispatchProps, SubProps>(() => {
    const getRideSearchList = createGetRideSearchList()

    return ({ rides, autocomplete }: StateModel, props) => ({
      rideList: getRideSearchList(rides, props),
      autocompleteList: autocomplete.list,
      isSearching: rides.isSearching,
      hasDepartSearchSuggestions:
        !props ||
        !props.query.departSearch ||
        (rides.departSuggestions && rides.departSuggestions.length > 0),
      hasArriveSearchSuggestions:
        !props ||
        !props.query.arriveSearch ||
        (rides.arriveSuggestions && rides.arriveSuggestions.length > 0),
    })
  }),
  watchProp<AllProps, Query>(
    props => props.query,
    (query, oldQuery, { dispatch }) => {
      if (!isEqual(query, oldQuery)) {
        dispatch(ridesActions.search.started(query))
      }
    }
  )
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

  const setSearchMode = (newIsSearchMode: boolean, newValues = query) => {
    if (newIsSearchMode) {
      history.push(routes.ridesList.search(newValues))
    } else {
      dispatch(ridesActions.cancelSearch({}))
      dispatch(autocompleteActions.cancel({}))
      history.push(routes.ridesList.root(newValues.mode))
    }
  }

  return (
    <div className={classnames(styles.page, styles[query.mode])}>
      <header
        className={classnames(
          styles.header,
          isSearchMode && styles.isSearchMode
        )}
      >
        <Form
          values={{ ...query }}
          onChange={(state: any, ...args: any[]) => {
            setQuery(state.values)
          }}
          component={false}
        >
          {({ submitForm }: any) => (
            <form
              action={routes.ridesList.search()}
              method="get"
              onSubmit={ev => {
                ev.preventDefault()
                submitForm()
              }}
            >
              <div className={styles.headerTop}>
                <Downshift
                  onChange={(item: AutocompletePredictionModel) => {
                    setQuery({
                      ...query,
                      departSearch: item.description,
                    })
                  }}
                  onStateChange={changes => {
                    if (changes.hasOwnProperty("isOpen") && !changes.isOpen) {
                      dispatch(autocompleteActions.cancel({}))
                    }
                  }}
                  defaultHighlightedIndex={0}
                >
                  {({
                    getRootProps,
                    getInputProps,
                    getItemProps,
                    isOpen,
                    highlightedIndex,
                    closeMenu,
                  }) => (
                    <div className={styles.fieldWrapper}>
                      <BoxField
                        field="departSearch"
                        {...getInputProps({
                          id: ids.RIDE_DEPART_SEARCH_INPUT,
                          type: isSearchMode ? "text" : "submit",
                          placeholder: isSearchMode
                            ? "Departure location"
                            : query.mode === "offer"
                              ? "Offer a ride"
                              : "Request a ride",
                          autoFocus:
                            isSearchMode &&
                            query.departSearch === undefined &&
                            query.arriveSearch === undefined,
                          onClick: () => {
                            // Downshift somehow intercepts html submit events,
                            // so we have to manually change the search mode.
                            if (!isSearchMode) {
                              setSearchMode(true)
                            }
                          },
                          onChange: ev => {
                            dispatch(
                              autocompleteActions.getList.started({
                                search: ev.currentTarget.value,
                              })
                            )
                          },
                          onKeyPress: ev => {
                            if (!isSearchMode && /\w|\d/.test(ev.key)) {
                              setSearchMode(true)
                            }
                          },
                        })}
                      >
                        {!query.departSearch && (
                          <IconButton
                            icon={<CurrentLocationSVG />}
                            onClick={() => {
                              const newValues: RideSearchModel = {
                                ...query,
                                departSearch: "Current Location",
                              }

                              if (isSearchMode) {
                                setQuery(newValues)
                              } else {
                                setSearchMode(true, newValues)
                              }
                            }}
                          />
                        )}
                      </BoxField>

                      {isOpen &&
                        props.autocompleteList.length > 0 && (
                          <ul className={styles.autocompleteList}>
                            {props.autocompleteList.map((item, index) => (
                              <li
                                key={item.place_id || item.description}
                                className={classnames(
                                  styles.autocompleteItem,
                                  index === highlightedIndex &&
                                    styles.highlighted
                                )}
                                {...getItemProps({ item, index })}
                              >
                                {item.description}
                              </li>
                            ))}
                          </ul>
                        )}
                    </div>
                  )}
                </Downshift>

                {isSearchMode ? (
                  <Link
                    to={routes.ridesList.root(query.mode)}
                    onClick={() => setSearchMode(false)}
                    title="Close"
                  >
                    <IconButton
                      className={styles.closeButton}
                      theme={{ ripple: styles.closeRipple } as any}
                      icon={<CloseSVG className={styles.closeIcon} />}
                    />
                  </Link>
                ) : (
                  <RadioGroup field="mode" className={styles.modeSwitch}>
                    <ModeButton mode="request" />
                    <ModeButton mode="offer" />
                  </RadioGroup>
                )}
              </div>

              <div className={styles.headerBottom}>
                <DownChevronSVG className={styles.downChevron} />

                <Downshift
                  onChange={(item: AutocompletePredictionModel) => {
                    setQuery({
                      ...query,
                      arriveSearch: item.description,
                    })
                  }}
                  onStateChange={changes => {
                    if (changes.hasOwnProperty("isOpen") && !changes.isOpen) {
                      dispatch(autocompleteActions.cancel({}))
                    }
                  }}
                  defaultHighlightedIndex={0}
                >
                  {({
                    getRootProps,
                    getInputProps,
                    getItemProps,
                    isOpen,
                    highlightedIndex,
                    closeMenu,
                  }) => (
                    <div className={styles.fieldWrapper}>
                      <BoxField
                        field="arriveSearch"
                        {...getInputProps({
                          id: ids.RIDE_ARRIVE_SEARCH_INPUT,
                          placeholder: "Destination",
                          onChange: ev => {
                            dispatch(
                              autocompleteActions.getList.started({
                                search: ev.currentTarget.value,
                              })
                            )
                          },
                        })}
                      />

                      {isOpen &&
                        props.autocompleteList.length > 0 && (
                          <ul className={styles.autocompleteList}>
                            {props.autocompleteList.map((item, index) => (
                              <li
                                key={item.place_id || item.description}
                                className={classnames(
                                  styles.autocompleteItem,
                                  index === highlightedIndex &&
                                    styles.highlighted
                                )}
                                {...getItemProps({ item, index })}
                              >
                                {item.description}
                              </li>
                            ))}
                          </ul>
                        )}
                    </div>
                  )}
                </Downshift>
              </div>

              {isSearchMode && <input type="submit" hidden />}
            </form>
          )}
        </Form>
      </header>

      <main
        className={classnames(styles.main, isSearchMode && styles.isSearchMode)}
      >
        <ul className={styles.rideList}>
          {props.rideList.map(({ id, ...ride }, i) => (
            <RideListItem
              {...ride}
              key={id}
              uri={routes.ride.detail(id)}
              isLast={i === props.rideList.length - 1}
            />
          ))}
        </ul>

        {(hasDepartSearchSuggestions && hasArriveSearchSuggestions) ||
        props.isSearching ? (
          <footer>
            <p className={styles.listFooterText}>
              Don't see what you're looking for?
            </p>

            {!query.departSearch ? (
              <Button
                className={styles.listFooterButton}
                onClick={() => {
                  document.getElementById(ids.RIDE_DEPART_SEARCH_INPUT)!.focus()
                }}
              >
                Add Departure Location
              </Button>
            ) : !query.arriveSearch ? (
              <Button
                className={styles.listFooterButton}
                onClick={() => {
                  document.getElementById(ids.RIDE_ARRIVE_SEARCH_INPUT)!.focus()
                }}
              >
                Add Destination
              </Button>
            ) : (
              !props.isSearching && (
                <Link
                  to={routes.ride.new(query)}
                  onClick={() => {
                    dispatch(ridesActions.resetDraft({ date: new Date() }))
                  }}
                >
                  <Button className={styles.listFooterButton}>
                    Create Ride Listing
                  </Button>
                </Link>
              )
            )}
          </footer>
        ) : (
          <footer>
            <p className={styles.listFooterText}>
              We couldn't find any matches on Google Maps for your
              {!hasDepartSearchSuggestions && " departure location "}
              {!(hasDepartSearchSuggestions || hasArriveSearchSuggestions) &&
                " or "}
              {!hasArriveSearchSuggestions && " destination "}
              search.
            </p>
            <p className={styles.listFooterText}>
              Make sure you spelled the address or search correctly.
            </p>

            {!hasDepartSearchSuggestions ? (
              <Button
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
            ) : (
              <Button
                className={styles.listFooterButton}
                onClick={() => {
                  const input = document.getElementById(
                    ids.RIDE_ARRIVE_SEARCH_INPUT
                  ) as HTMLInputElement

                  input.select()
                }}
              >
                Edit Destination
              </Button>
            )}
          </footer>
        )}
      </main>

      <footer className={styles.navFooter}>
        <Nav ridesPath={props.location.pathname} />
      </footer>
    </div>
  )
}

export default withController(RideListPage)
