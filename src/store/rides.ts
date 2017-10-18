/**
 * @file rides.ts
 *
 * Created by Zander Otavka on 6/12/17.
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

import actionCreatorFactory, { Action } from "typescript-fsa"
import { reducerWithInitialState } from "typescript-fsa-reducers"
import maxDate from "date-fns/max"
import { MiddlewareAPI } from "redux"
import { combineEpics, ActionsObservable } from "redux-observable"
import { database } from "firebase"
import { createSelector } from "reselect"

import { Observable } from "rxjs/Observable"
import { EventTargetLike } from "rxjs/observable/FromEventObservable"
import "rxjs/add/observable/of"
import "rxjs/add/observable/from"
import "rxjs/add/observable/fromEvent"
import "rxjs/add/observable/zip"
import "rxjs/add/observable/merge"
import "rxjs/add/observable/empty"
import "rxjs/add/operator/filter"
import "rxjs/add/operator/map"
import "rxjs/add/operator/mergeMap"
import "rxjs/add/operator/catch"
import "rxjs/add/operator/debounceTime"

import { StateModel } from "./index"

import { toFirebase, fromFirebase } from "../util/firebaseConvert"
import { QueryComponentProps } from "../controllers/connectQuery"

/// <reference types="googlemaps" />
type PlacesService = google.maps.places.PlacesService
type PlacesServiceStatusType = typeof google.maps.places.PlacesServiceStatus

export interface RidesDependencies {
  placesServicePromise: Promise<PlacesService>
  placesServiceStatusPromise: Promise<PlacesServiceStatusType>
  ridesListRefPromise: Promise<database.Reference>
  locationsRefPromise: Promise<database.Reference>
}

// Models

export interface LocationModel {
  place_id: string
  name: string
  latitude: number
  longitude: number
}

export interface RideSearchFields {
  readonly departSearch?: string
  readonly arriveSearch?: string
}

export interface RideSearchModel extends RideSearchFields {
  readonly mode: "request" | "offer"
}

export interface DraftModel {
  readonly departLocation: string
  readonly departDateTime: Date
  readonly arriveLocation: string
  readonly arriveDateTime: Date
  readonly seatTotal: number
}

export interface RideModel extends DraftModel {
  readonly id: string
}

export interface LocationMapModel {
  readonly [id: string]: LocationModel
}

export interface RidesModel {
  readonly locations: LocationMapModel
  readonly list: ReadonlyArray<RideModel>
  readonly draft: DraftModel
  readonly isCreating: boolean
  readonly lastCreated: string | null
  readonly isSearching: boolean
  readonly departSuggestions: ReadonlyArray<LocationModel>
  readonly arriveSuggestions: ReadonlyArray<LocationModel>
}

// Selectors

const getRideList = (rides: RidesModel) => rides.list
const getDepartSuggestions = (rides: RidesModel) => rides.departSuggestions
const getArriveSuggestions = (rides: RidesModel) => rides.arriveSuggestions

type QueryProps = QueryComponentProps<{}, RideSearchModel>
const getHasDepartSearch = (state: never, props: QueryProps | undefined) =>
  props && !!props.query.departSearch
const getHasArriveSearch = (state: never, props: QueryProps | undefined) =>
  props && !!props.query.arriveSearch

export const createGetRideSearchList = () =>
  createSelector(
    getRideList,
    getDepartSuggestions,
    getArriveSuggestions,
    getHasDepartSearch,
    getHasArriveSearch,
    (
      list,
      departSuggestions,
      arriveSuggestions,
      hasDepartSearch,
      hasArriveSearch
    ) =>
      list.filter(
        ride =>
          (!hasDepartSearch ||
            departSuggestions.some(
              suggestion => suggestion.place_id === ride.departLocation
            )) &&
          (!hasArriveSearch ||
            arriveSuggestions.some(
              suggestion => suggestion.place_id === ride.arriveLocation
            ))
      )
  )

// Actions

export namespace ridesActions {
  const actionCreator = actionCreatorFactory("Rides")

  export type ReceiveLocation = LocationModel
  export const receiveLocation = actionCreator<ReceiveLocation>(
    "RECEIVE_LOCATION"
  )

  export type Receive = RideModel
  export const receive = actionCreator<Receive>("RECEIVE")

  export type SearchParams = RideSearchModel
  export type SearchResult = {
    departSuggestions: ReadonlyArray<Readonly<LocationModel>> | null
    arriveSuggestions: ReadonlyArray<Readonly<LocationModel>> | null
  }
  export const search = actionCreator.async<SearchParams, SearchResult>(
    "SEARCH"
  )

  export type CancelSearch = {}
  export const cancelSearch = actionCreator<CancelSearch>("CANCEL_SEARCH")

  export type ResetDraft = { date: Date }
  export const resetDraft = actionCreator<ResetDraft>("RESET_DRAFT")

  export type UpdateDraft = DraftModel
  export const updateDraft = actionCreator<UpdateDraft>("UPDATE_DRAFT")

  export type CreateParams = DraftModel
  export type CreateResult = { id: string | null }
  export const create = actionCreator.async<CreateParams, CreateResult>(
    "CREATE"
  )
}

// Reducers

export function getDefaultLocation(
  suggestions: ReadonlyArray<LocationModel> | null,
  currentLocation: string = ""
) {
  return suggestions &&
    suggestions.length > 0 &&
    // true if suggestions list does not contain currentLocation.
    // We don't have to look through the list for an empty currentLocation.
    (currentLocation === "" ||
      !suggestions.reduce(
        (hasLocation, suggestion) =>
          hasLocation || suggestion.place_id === currentLocation,
        false
      ))
    ? suggestions[0].place_id
    : currentLocation
}

export function insertRide(list: ReadonlyArray<RideModel>, ride: RideModel) {
  for (let i = 0; i < list.length; i++) {
    if (ride.departDateTime < list[i].departDateTime) {
      return [...list.slice(0, i), ride, ...list.slice(i)]
    }
  }

  return [...list, ride]
}

export const ridesReducer = reducerWithInitialState<RidesModel>({
  locations: {},
  list: [],
  draft: {
    departLocation: "",
    departDateTime: new Date(),
    arriveLocation: "",
    arriveDateTime: new Date(),
    seatTotal: 0,
  },
  isCreating: false,
  lastCreated: null,
  isSearching: false,
  departSuggestions: [],
  arriveSuggestions: [],
})
  .case(ridesActions.receiveLocation, (state, payload) => ({
    ...state,
    locations: {
      ...state.locations,
      [payload.place_id]: payload,
    },
  }))
  .case(ridesActions.receive, (state, payload) => ({
    ...state,
    list: insertRide(state.list, payload),
  }))
  .case(ridesActions.search.started, state => ({
    ...state,
    isSearching: true,
  }))
  .case(ridesActions.search.done, ({ draft, ...state }, { result }) => ({
    ...state,
    draft: {
      ...draft,
      departLocation: getDefaultLocation(
        result.departSuggestions,
        draft.departLocation
      ),
      arriveLocation: getDefaultLocation(
        result.arriveSuggestions,
        draft.arriveLocation
      ),
    },
    isSearching: false,
    departSuggestions: result.departSuggestions || state.departSuggestions,
    arriveSuggestions: result.arriveSuggestions || state.arriveSuggestions,
  }))
  .case(ridesActions.updateDraft, ({ draft, ...state }, payload) => ({
    ...state,
    draft: {
      ...payload,
      arriveDateTime: maxDate(payload.departDateTime, payload.arriveDateTime),
      seatTotal: Math.min(Math.max(payload.seatTotal, 0), 99),
    },
  }))
  .case(ridesActions.resetDraft, (state, { date }) => ({
    ...state,
    draft: {
      departLocation: getDefaultLocation(state.departSuggestions),
      departDateTime: date,
      arriveLocation: getDefaultLocation(state.arriveSuggestions),
      arriveDateTime: date,
      seatTotal: 0,
    },
  }))
  .case(ridesActions.create.started, state => ({
    ...state,
    isCreating: true,
  }))
  .case(ridesActions.create.done, (state, { result }) => ({
    ...state,
    isCreating: false,
    lastCreated: result.id,
  }))
  .case(ridesActions.create.failed, state => ({
    ...state,
    isCreating: false,
  }))
  .build()

// Epics

export function toLocationModel({
  place_id,
  name,
  geometry,
}: google.maps.places.PlaceResult): LocationModel {
  return {
    place_id,
    name,
    latitude: geometry.location.lat(),
    longitude: geometry.location.lng(),
  }
}

export function getLocationDetails(
  locationsRef: database.Reference,
  service: PlacesService,
  Status: PlacesServiceStatusType,
  placeId: string,
  getLocationsState: () => LocationMapModel
) {
  const locations = getLocationsState()
  if (locations[placeId]) {
    return Observable.empty<never>()
  } else {
    return Observable.from(locationsRef.child(placeId).once("value"))
      .map((snapshot: database.DataSnapshot) => {
        if (snapshot.exists && snapshot.val() !== null) {
          return snapshot.val() as LocationModel
        } else {
          throw Error()
        }
      })
      .catch(
        () =>
          new Observable<LocationModel>(observer => {
            service.getDetails({ placeId }, (result, status) => {
              if (status === Status.OK) {
                const location = toLocationModel(result)

                observer.next(location)
                observer.complete()

                locationsRef
                  .child(location.place_id)
                  .set(location)
                  .catch(err => {
                    console.error(
                      "There was a problem saving the location to Firebase",
                      err
                    )
                  })
              } else {
                observer.error(new Error(`Failed with status: ${status}`))
              }
            })
          })
      )
  }
}

export function listEpic(
  actionsObservable: ActionsObservable<Action<any>>,
  store: MiddlewareAPI<StateModel>,
  {
    ridesListRefPromise,
    locationsRefPromise,
    placesServicePromise,
    placesServiceStatusPromise,
  }: RidesDependencies
) {
  return Observable.from(ridesListRefPromise)
    .flatMap(ridesListRef => {
      const query = ridesListRef
        .orderByChild("departDateTime/value")
        .startAt(Date.now()) as EventTargetLike

      // TODO: handle child_changed and child_removed
      // We don't have to worry about child_moved since we don't want to
      // move/reorder things and we won't add a path for that for the user.
      return Observable.fromEvent<database.DataSnapshot>(query, "child_added")
    })
    .map(snapshot => ({
      ...(fromFirebase(snapshot.val()) as RideModel),
      id: snapshot.key || "",
    }))
    .flatMap(ride =>
      Observable.merge(
        Observable.of(ridesActions.receive(ride)),
        Observable.zip(
          locationsRefPromise,
          placesServicePromise,
          placesServiceStatusPromise
        )
          .flatMap(([locationsRef, service, Status]) =>
            Observable.merge(
              getLocationDetails(
                locationsRef,
                service,
                Status,
                ride.departLocation,
                () => store.getState().rides.locations
              ).catch(err => (console.error(err), Observable.empty<never>())),
              getLocationDetails(
                locationsRef,
                service,
                Status,
                ride.arriveLocation,
                () => store.getState().rides.locations
              ).catch(err => (console.error(err), Observable.empty<never>()))
            )
          )
          .map(location => ridesActions.receiveLocation(location))
      ).catch(err => (console.error(err), Observable.empty<never>()))
    )
}

export function getSearchResults(
  service: PlacesService,
  Status: PlacesServiceStatusType,
  query: string | undefined
) {
  return new Observable<LocationModel[] | null>(observer => {
    if (query) {
      service.textSearch({ query }, (result, status) => {
        if (status === Status.OK || status === Status.ZERO_RESULTS) {
          observer.next(result ? result.map(toLocationModel) : [])
          observer.complete()
        } else {
          observer.error(new Error(`Failed with status: ${status}`))
        }
      })
    } else {
      observer.next(query === "" ? [] : null)
      observer.complete()
    }
  })
}

export function searchEpic(
  actionsObservable: ActionsObservable<Action<any>>,
  store: MiddlewareAPI<StateModel>,
  { placesServicePromise, placesServiceStatusPromise }: RidesDependencies
) {
  return actionsObservable
    .filter(ridesActions.search.started.match)
    .debounceTime(500)
    .flatMap(({ payload }) =>
      Observable.zip(placesServicePromise, placesServiceStatusPromise)
        .flatMap(([service, Status]) =>
          Observable.zip(
            getSearchResults(service, Status, payload.departSearch),
            getSearchResults(service, Status, payload.arriveSearch),
            (departSuggestions, arriveSuggestions) => ({
              departSuggestions,
              arriveSuggestions,
            })
          )
        )
        .map(result => ridesActions.search.done({ params: payload, result }))
        .catch(error =>
          Observable.of(
            ridesActions.search.failed({
              params: payload,
              error,
            })
          )
        )
    )
}

export function createStartedToUpdateDraftEpic(
  actionsObservable: ActionsObservable<Action<any>>
) {
  return actionsObservable
    .filter(ridesActions.create.started.match)
    .map(({ payload }) => ridesActions.updateDraft(payload))
}

export function createDoneToResetDraftEpic(
  actionsObservable: ActionsObservable<Action<any>>
) {
  return actionsObservable
    .filter(ridesActions.create.done.match)
    .map(({ payload }) => ridesActions.resetDraft({ date: new Date() }))
}

export function createRideEpic(
  actionsObservable: ActionsObservable<Action<any>>,
  store: MiddlewareAPI<StateModel>,
  { ridesListRefPromise }: RidesDependencies
) {
  return actionsObservable
    .filter(ridesActions.create.started.match)
    .flatMap(({ payload }) =>
      Observable.from(ridesListRefPromise).flatMap(ridesListRef =>
        Observable.from<database.Reference>(
          ridesListRef.push(toFirebase(payload))
        )
          .map(ref =>
            ridesActions.create.done({
              params: payload,
              result: { id: ref.key || null },
            })
          )
          .catch(error =>
            Observable.of(
              ridesActions.create.failed({ params: payload, error })
            )
          )
      )
    )
}

export const ridesEpic = combineEpics(
  listEpic,
  searchEpic,
  createStartedToUpdateDraftEpic,
  createDoneToResetDraftEpic,
  createRideEpic
)
