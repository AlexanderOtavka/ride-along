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

import { createStore, combineReducers } from "redux"
import { devToolsEnhancer } from "redux-devtools-extension"

import { RidesModel, ridesReducer } from "./rides"

export interface StateModel {
  readonly rides: RidesModel
}

export const ridesSelector = (state: StateModel) => state.rides

const reducer = combineReducers<StateModel>({
  rides: ridesReducer,
})

export default function getStore(initialState: StateModel | null = null) {
  const enhancer = devToolsEnhancer({})

  return initialState !== null
    ? createStore<StateModel>(reducer, initialState, enhancer)
    : createStore<StateModel>(reducer, enhancer)
}
