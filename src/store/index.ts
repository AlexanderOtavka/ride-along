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
import { createEpicMiddleware, combineEpics } from "redux-observable"
import { Action } from "typescript-fsa"

import { RidesModel, ridesReducer, ridesEpic, RidesDependencies } from "./rides"
import {
  AutocompleteModel,
  autocompleteReducer,
  autocompleteEpic,
  AutocompleteDependencies,
} from "./autocomplete"

export interface Dependencies
  extends RidesDependencies,
    AutocompleteDependencies {}

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

const epic = combineEpics<Action<any>, StateModel, Dependencies>(
  ridesEpic,
  autocompleteEpic
)

export default function configureStore(
  dependencies: Dependencies,
  initialState: StateModel | null = null
) {
  const epicMiddleware = createEpicMiddleware(epic, { dependencies })
  const enhancer = composeWithDevTools(applyMiddleware(epicMiddleware))

  return initialState !== null
    ? createStore<StateModel>(reducer, initialState, enhancer)
    : createStore<StateModel>(reducer, enhancer)
}
