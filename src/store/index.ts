/**
 * @file index.ts
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

import { createStore, combineReducers, applyMiddleware } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import createSagaMiddleware, { SagaIterator } from "redux-saga"
import { all, call } from "redux-saga/effects"

import { RidesModel, ridesReducer, ridesPersistentSaga } from "./rides"
import {
  AutocompleteModel,
  autocompleteReducer,
  autocompletePersistentSaga,
} from "./autocomplete"
import Dependencies from "./Dependencies"

export interface StateModel {
  readonly rides: RidesModel
  readonly autocomplete: AutocompleteModel
}

export const ridesSelector = (state: StateModel) => state.rides
export const autocompleteSelector = (state: StateModel) => state.autocomplete

const reducer = combineReducers<StateModel>({
  rides: ridesReducer,
  autocomplete: autocompleteReducer,
})

function* persistentSaga(deps: Dependencies): SagaIterator {
  yield all([
    call(autocompletePersistentSaga, deps),
    call(ridesPersistentSaga, deps),
  ])
}

export default function configureStore(initialState: StateModel | null = null) {
  const sagaMiddleware = createSagaMiddleware()
  const enhancer = composeWithDevTools(applyMiddleware(sagaMiddleware))

  const store =
    initialState !== null
      ? createStore<StateModel>(reducer, initialState, enhancer)
      : createStore<StateModel>(reducer, enhancer)

  const runPersistentSaga = (deps: Dependencies) => {
    sagaMiddleware.run(persistentSaga, deps)
  }

  return { ...store, runPersistentSaga }
}
