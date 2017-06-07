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
import { Form, RadioGroup } from "react-form"
import querystring from "querystring"
import classes from "classnames"

import BoxField from "./BoxField"
import ModeButton from "./ModeButton"

import styles from "./RideListHeader.sass"

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

export default function RideListHeader({ history, ...props }: Props) {
  const query = querystring.parse(
    props.location.search.substring(1)
  ) as QueryParams
  const selectedMode = query.mode || "request"
  const isSearchMode = !!props.match.params[0]
  const updateURL = (values: QueryParams) => {
    const urlValues = isSearchMode ? values : { mode: values.mode }
    history.replace("?" + querystring.stringify(urlValues))
  }

  return (
    <header className={classes(styles.header, selectedMode)}>
      <Form
        values={{
          ...query,
          mode: selectedMode,
        }}
        onChange={({ values }: any) => updateURL(values)}
        onSubmit={updateURL}
        component={false}
      >
        {({ submitForm, values }: any) =>
          <form
            onSubmit={ev => {
              ev.preventDefault()
              history.push("/search")
              submitForm()
            }}
            action="/search"
            method="get"
          >
            <div className={styles.headerTop}>
              <BoxField
                field="departLocation"
                isButton={!isSearchMode}
                placeholder={
                  isSearchMode ? "Departure location" : "Request a ride"
                }
                autoFocus={
                  isSearchMode &&
                  values.departLocation === undefined &&
                  values.arriveLocation === undefined
                }
              />

              {isSearchMode ||
                <RadioGroup field="mode" className={styles.modeSwitch}>
                  <ModeButton mode="request" />
                  <ModeButton mode="offer" />
                </RadioGroup>}
            </div>

            <div
              className={classes(
                styles.headerBottom,
                isSearchMode && styles.inSearchMode
              )}
            >
              <DownChevronSVG className={styles.downChevron} />
              <BoxField field="arriveLocation" placeholder="Destination" />
            </div>

            {isSearchMode && <input type="submit" hidden />}
          </form>}
      </Form>
    </header>
  )
}
