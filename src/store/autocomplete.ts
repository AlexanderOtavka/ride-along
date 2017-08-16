/**
 * @file autocomplete.ts
 *
 * Created by Zander Otavka on 6/27/17.
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
import { SagaIterator } from "redux-saga"
import { call, put, throttle } from "redux-saga/effects"

import Dependencies from "./Dependencies"
import { RideSearchFields } from "./rides"

/// <reference types="googlemaps" />
type AutocompleteService = google.maps.places.AutocompleteService
type AutocompletionRequest = google.maps.places.AutocompletionRequest
type PlacesServiceStatusType = typeof google.maps.places.PlacesServiceStatus

// Models

export type AutocompletePredictionModel = google.maps.places.QueryAutocompletePrediction

export interface AutocompleteModel {
  readonly field: keyof RideSearchFields | ""
  readonly list: ReadonlyArray<AutocompletePredictionModel>
}

// Actions

export namespace autocompleteActions {
  const actionCreator = actionCreatorFactory("Autocomplete")

  export type GetListParams = {
    field: keyof RideSearchFields
    search: string
  }
  export type GetListResult = {
    list: ReadonlyArray<AutocompletePredictionModel>
  }
  export const getList = actionCreator.async<GetListParams, GetListResult>(
    "GET_LIST"
  )

  export type Cancel = {}
  export const cancel = actionCreator<Cancel>("CANCEL")
}

// Reducers

export const autocompleteReducer = reducerWithInitialState<AutocompleteModel>({
  field: "",
  list: [],
})
  .case(autocompleteActions.getList.done, (state, payload) => ({
    field: payload.params.field,
    list: payload.result.list,
  }))
  .case(autocompleteActions.cancel, () => ({
    field: "",
    list: [],
  }))
  .build()

// Sagas

export function getPlacePredictions(
  service: AutocompleteService,
  PlacesServiceStatus: PlacesServiceStatusType,
  request: AutocompletionRequest
) {
  return new Promise<AutocompletePredictionModel[]>((resolve, reject) => {
    service.getQueryPredictions(request, (result, status) => {
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

export function* autocompleteWorkerSaga(
  service: AutocompleteService,
  PlacesServiceStatus: PlacesServiceStatusType,
  action: Action<autocompleteActions.GetListParams>
): SagaIterator {
  try {
    const predictions: AutocompletePredictionModel[] = yield call(
      getPlacePredictions,
      service,
      PlacesServiceStatus,
      { input: action.payload.search }
    )

    yield put(
      autocompleteActions.getList.done({
        params: action.payload,
        result: {
          list: predictions,
        },
      })
    )
  } catch (error) {
    yield put(
      autocompleteActions.getList.failed({
        params: action.payload,
        error,
      })
    )
  }
}

export function* autocompletePersistentSaga(deps: Dependencies): SagaIterator {
  const places: typeof google.maps.places = yield call(deps.getPlacesAPI)
  const service = new places.AutocompleteService()

  yield throttle(
    500,
    autocompleteActions.getList.started.type,
    autocompleteWorkerSaga,
    service,
    places.PlacesServiceStatus
  )
}
