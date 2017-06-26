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

import actionCreatorFactory from "typescript-fsa"
import { reducerWithInitialState } from "typescript-fsa-reducers"

// Models

export interface RideSearchModel {
  readonly mode: "request" | "offer"
  readonly departLocation?: string
  readonly arriveLocation?: string
}

export interface RideModel {
  readonly uid: string
  readonly departureLocation: string
  readonly departureDateTime: Date
  readonly arrivalLocation: string
  readonly arrivalDateTime: Date
}

export interface RidesModel {
  readonly list: ReadonlyArray<RideModel>
  readonly isDoneLoading: boolean
}

// Actions

export namespace ridesActions {
  const actionCreator = actionCreatorFactory("Rides")

  export type LoadMore = {}
  export const loadMore = actionCreator<LoadMore>("LOAD_MORE")

  export type Receive = {
    list: ReadonlyArray<RideModel>
    isDoneLoading: boolean
  }
  export const receive = actionCreator<Receive>("RECEIVE")

  export type Search = Partial<RideSearchModel>
  export const search = actionCreator<Search>("SEARCH")
}

// Reducers

export const ridesReducer = reducerWithInitialState<RidesModel>({
  list: require("../constants/exampleRides").default,
  isDoneLoading: true,
}).case(ridesActions.receive, (state, payload) => payload)
