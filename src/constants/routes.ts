/**
 * @file routes.ts
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

import querystring from "querystring"

import { RideSearchModel } from "../store/rides"

const stringifyQuery = (query?: { [key: string]: any }) =>
  query ? "?" + querystring.stringify(query) : ""

export const ridesList = {
  root: (mode?: "request" | "offer") => (mode ? `/?mode=${mode}` : "/"),
  search: (query?: RideSearchModel) => "/search" + stringifyQuery(query),
  matchPath: "/(search)?",
}

export const ride = {
  root: "/rides",
  detail: (id: string) => `/rides/${id}`,
  new: (query?: RideSearchModel) => "/rides/new" + stringifyQuery(query),
}

export const profile = {
  root: "/me",
}

export const feedback = "/feedback"
