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
import { SagaIterator, buffers, delay } from "redux-saga"
import { call, put, actionChannel, take, fork } from "redux-saga/effects"
import isEqual from "lodash/isEqual"
import omitBy from "lodash/omitBy"
import maxDate from "date-fns/max"

import Dependencies from "./Dependencies"

import exampleRides from "../constants/exampleRides"

/// <reference types="googlemaps" />
type PlaceResult = google.maps.places.PlaceResult
type PlacesService = google.maps.places.PlacesService
type TextSearchRequest = google.maps.places.TextSearchRequest
type PlacesServiceStatusType = typeof google.maps.places.PlacesServiceStatus

// Models

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
}

export interface RideModel extends DraftModel {
  readonly id: string
}

export interface RidesModel {
  readonly list: ReadonlyArray<RideModel>
  readonly draft: DraftModel
  readonly departSuggestions: ReadonlyArray<PlaceResult>
  readonly arriveSuggestions: ReadonlyArray<PlaceResult>
}

// Actions

export namespace ridesActions {
  const actionCreator = actionCreatorFactory("Rides")

  export type LoadMore = {}
  export const loadMore = actionCreator<LoadMore>("LOAD_MORE")

  export type Receive = { list: ReadonlyArray<RideModel> }
  export const receive = actionCreator<Receive>("RECEIVE")

  export type SearchParams = RideSearchModel
  export type SearchResult = {
    departSuggestions?: ReadonlyArray<Readonly<PlaceResult>>
    arriveSuggestions?: ReadonlyArray<Readonly<PlaceResult>>
  }
  export const search = actionCreator.async<SearchParams, SearchResult>(
    "SEARCH"
  )

  export type CancelSearch = {}
  export const cancelSearch = actionCreator<CancelSearch>("CANCEL_SEARCH")

  export type ResetDraft = { date: Date }
  export const resetDraft = actionCreator<ResetDraft>("RESET_DRAFT")

  export type UpdateDraft = Partial<DraftModel>
  export const updateDraft = actionCreator<UpdateDraft>("UPDATE_DRAFT")

  export type CreateParams = {}
  export type CreateResult = { id: string }
  export const create = actionCreator.async<CreateParams, CreateResult>(
    "CREATE"
  )
}

// Reducers

function getDefaultLocation(
  suggestions: ReadonlyArray<PlaceResult> | undefined,
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

export const ridesReducer = reducerWithInitialState<RidesModel>({
  list: exampleRides, // TODO: start with empty list
  draft: {
    departLocation: "",
    departDateTime: new Date(),
    arriveLocation: "",
    arriveDateTime: new Date(),
  },
  departSuggestions: [],
  arriveSuggestions: [],
})
  .case(ridesActions.receive, (state, payload) => ({ ...state, ...payload }))
  .case(ridesActions.search.done, ({ draft, ...state }, { result }) => ({
    ...state,
    ...result,
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
  }))
  .case(ridesActions.updateDraft, ({ draft, ...state }, payload) => ({
    ...state,
    draft: {
      ...draft,
      ...omitBy(payload, x => x === undefined),
      arriveDateTime: maxDate(
        payload.departDateTime || draft.departDateTime,
        payload.arriveDateTime || draft.arriveDateTime
      ),
    },
  }))
  .case(ridesActions.resetDraft, (state, { date }) => ({
    ...state,
    draft: {
      departLocation: getDefaultLocation(state.departSuggestions),
      departDateTime: date,
      arriveLocation: getDefaultLocation(state.arriveSuggestions),
      arriveDateTime: date,
    },
  }))
  .build()

// Sagas

export function getSearchResults(
  service: PlacesService,
  PlacesServiceStatus: PlacesServiceStatusType,
  request: TextSearchRequest
) {
  return new Promise<PlaceResult[]>((resolve, reject) => {
    service.textSearch(request, (result, status) => {
      if (
        status === PlacesServiceStatus.OK ||
        status === PlacesServiceStatus.ZERO_RESULTS
      ) {
        resolve(result)
      } else {
        reject(new Error(`Failed with status: ${status}`))
      }
    })
  })
}

export function* searchWorkerSaga(
  service: PlacesService,
  PlacesServiceStatus: PlacesServiceStatusType,
  { payload }: Action<ridesActions.SearchParams>
): SagaIterator {
  try {
    const departSuggestions: PlaceResult[] = payload.departSearch
      ? yield call(getSearchResults, service, PlacesServiceStatus, {
          query: payload.departSearch,
        })
      : payload.departSearch === undefined ? undefined : []

    const arriveSuggestions: PlaceResult[] = payload.arriveSearch
      ? yield call(getSearchResults, service, PlacesServiceStatus, {
          query: payload.arriveSearch,
        })
      : payload.arriveSearch === undefined ? undefined : []

    yield put(
      ridesActions.search.done({
        params: payload,
        result: {
          departSuggestions,
          arriveSuggestions,
        },
      })
    )
  } catch (error) {
    yield put(
      ridesActions.search.failed({
        params: payload,
        error: error.message,
      })
    )
  }
}

export function* searchPersistentSaga(deps: Dependencies): SagaIterator {
  const places: typeof google.maps.places = yield call(deps.getPlacesAPI)
  const service = new places.PlacesService(deps.poweredByGoogleNode)

  const channel = yield actionChannel(
    ridesActions.search.started.type,
    buffers.sliding(1)
  )
  let oldPayload: ridesActions.SearchParams | undefined

  while (true) {
    let action: Action<ridesActions.SearchParams>
    do {
      action = yield take(channel)
    } while (isEqual(action.payload, oldPayload))
    oldPayload = action.payload

    yield fork(searchWorkerSaga, service, places.PlacesServiceStatus, action)
    yield call(delay, 1000)
  }
}

export function* ridesPersistentSaga(deps: Dependencies): SagaIterator {
  yield fork(searchPersistentSaga, deps)
}
