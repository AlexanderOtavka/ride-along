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

import { MiddlewareAPI } from "redux"
import actionCreatorFactory, { Action } from "typescript-fsa"
import { reducerWithInitialState } from "typescript-fsa-reducers"
import { ActionsObservable } from "redux-observable"

import { Observable } from "rxjs/Observable"
import "rxjs/add/observable/of"
import "rxjs/add/observable/zip"
import "rxjs/add/operator/filter"
import "rxjs/add/operator/map"
import "rxjs/add/operator/mergeMap"
import "rxjs/add/operator/catch"
import "rxjs/add/operator/debounceTime"

import { RideSearchFields } from "./rides"
import { StateModel } from "./index"

import createTypeChecker from "../util/createTypeChecker"

/// <reference types="googlemaps" />
type AutocompleteService = google.maps.places.AutocompleteService
type PlacesServiceStatusType = typeof google.maps.places.PlacesServiceStatus

export interface AutocompleteDependencies {
  autocompleteServicePromise: Promise<AutocompleteService>
  placesServiceStatusPromise: Promise<PlacesServiceStatusType>
}

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

// Epics

export function getPlacePredictions(
  service: AutocompleteService,
  Status: PlacesServiceStatusType,
  input: string
) {
  return new Observable<AutocompletePredictionModel[]>(observer => {
    service.getQueryPredictions({ input }, (result, status) => {
      if (status === Status.OK || status === Status.ZERO_RESULTS) {
        observer.next(result)
        observer.complete()
      } else {
        observer.error(new Error(`Failed with status: ${status}`))
      }
    })
  })
}

export function autocompleteEpic(
  actionsObservable: ActionsObservable<Action<any>>,
  store: MiddlewareAPI<StateModel>,
  {
    autocompleteServicePromise,
    placesServiceStatusPromise,
  }: AutocompleteDependencies
) {
  return actionsObservable
    .filter(createTypeChecker(autocompleteActions.getList.started))
    .debounceTime(500)
    .flatMap(({ payload }) =>
      Observable.zip(
        autocompleteServicePromise,
        placesServiceStatusPromise
      ).flatMap(([service, Status]) =>
        getPlacePredictions(service, Status, payload.search)
          .map(list =>
            autocompleteActions.getList.done({
              params: payload,
              result: {
                list,
              },
            })
          )
          .catch(error =>
            Observable.of(
              autocompleteActions.getList.failed({
                params: payload,
                error,
              })
            )
          )
      )
    )
}
