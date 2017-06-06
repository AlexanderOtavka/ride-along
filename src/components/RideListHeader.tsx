/**
 * @file RideListHeader.tsx
 *
 * Created by Zander Otavka on .
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
import { RouteComponentProps } from "react-router-dom"
import querystring from "querystring"
import classes from "classnames"

import BoxField from "./BoxField"
import ModeButton from "./ModeButton"

import styles from "./RideListHeader.css"

import ThumbSVG from "../drawables/thumb-right.svg"
import CarSVG from "../drawables/car-side.svg"
import DownChevronSVG from "../drawables/down-chevron.svg"

interface QueryParams {
  mode?: "request" | "offer"
  departLocation?: string
  arriveLocation?: string
}

interface MatchParams {
  0: "search" | undefined
}

interface Props extends RouteComponentProps<MatchParams> {}

export default function RideListHeader({ location, match }: Props) {
  const query = querystring.parse(location.search.substring(1)) as QueryParams
  const selectedMode = query.mode || "request"
  const isSearchMode = !!match.params[0]

  return (
    <header className={classes(styles.header, selectedMode)}>
      <form action="/search" method="get">
        <div className={styles.headerTop}>
          {isSearchMode
            ? <BoxField
                defaultValue={query.departLocation || ""}
                name="departLocation"
                placeholder="Departure location"
                autoFocus={true}
              />
            : <BoxField type="submit" value="Request a ride" />}

          {isSearchMode ||
            <div className={styles.modeSwitch}>
              <ModeButton
                name="mode"
                mode="request"
                selectedMode={selectedMode}
                image={<ThumbSVG />}
              />
              <ModeButton
                name="mode"
                mode="offer"
                selectedMode={selectedMode}
                image={<CarSVG />}
              />
            </div>}
        </div>

        <div
          className={classes(
            styles.headerBottom,
            isSearchMode && styles.inSearchMode
          )}
        >
          <DownChevronSVG className={styles.downChevron} />
          <BoxField
            defaultValue={query.arriveLocation || ""}
            name="arriveLocation"
            placeholder="Destination"
          />
        </div>

        {isSearchMode && <input type="submit" hidden />}
      </form>
    </header>
  )
}
