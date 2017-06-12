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
import { RouteComponentProps, Link, withRouter } from "react-router-dom"
import { Form, RadioGroup } from "react-form"
import { IconButton } from "react-toolbox/lib/button"
import querystring from "querystring"
import classnames from "classnames"

import BoxField from "./BoxField"
import ModeButton from "./ModeButton"

import * as routes from "../constants/routes"

import styles from "./RideListHeader.sass"

import DownChevronSVG from "../drawables/down-chevron.svg"
import CloseSVG from "../drawables/close.svg"
import CurrentLocationSVG from "../drawables/crosshairs-gps.svg"

interface QueryParams {
  mode?: "request" | "offer"
  departLocation?: string
  arriveLocation?: string
}

export interface Props extends RouteComponentProps<{}> {
  isSearchMode: boolean
}

function RideListHeader({ history, isSearchMode, ...props }: Props) {
  const query = querystring.parse(
    props.location.search.substring(1) // chop off the ?
  ) as QueryParams
  const selectedMode = query.mode || "request"
  const updateURL = (values: QueryParams) => {
    const urlValues = isSearchMode ? values : { mode: values.mode }
    history.replace("?" + querystring.stringify(urlValues))
  }

  return (
    <header className={classnames(styles.header, styles[selectedMode])}>
      <Form
        values={{
          ...query,
          mode: selectedMode,
        }}
        onChange={({ values }: any) => updateURL(values)}
        postSubmit={updateURL}
        component={false}
      >
        {({ submitForm, values }: any) =>
          <form
            onSubmit={ev => {
              ev.preventDefault()
              history.push(routes.rides.search)
              submitForm()
            }}
            action={routes.rides.search}
            method="get"
          >
            <div className={styles.headerTop}>
              <BoxField
                field="departLocation"
                type={isSearchMode ? "text" : "submit"}
                placeholder={
                  isSearchMode
                    ? "Departure location"
                    : selectedMode === "request"
                      ? "Request a ride"
                      : "Offer a ride"
                }
                autoFocus={
                  isSearchMode &&
                  values.departLocation === undefined &&
                  values.arriveLocation === undefined
                }
              >
                {!values.departLocation &&
                  <IconButton
                    icon={<CurrentLocationSVG />}
                    onClick={() =>
                      updateURL({
                        ...values,
                        departLocation: "Current Location",
                      })}
                  />}
              </BoxField>

              {isSearchMode
                ? <Link
                    to={`${routes.rides.root}?mode=${query.mode}`}
                    title="Close"
                  >
                    <IconButton
                      className={styles.closeButton}
                      theme={{ ripple: styles.closeRipple } as any}
                      icon={<CloseSVG className={styles.closeIcon} />}
                    />
                  </Link>
                : <RadioGroup field="mode" className={styles.modeSwitch}>
                    <ModeButton mode="request" />
                    <ModeButton mode="offer" />
                  </RadioGroup>}
            </div>

            <div
              className={classnames(
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

export default withRouter(RideListHeader)
