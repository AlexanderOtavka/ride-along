/**
 * @file AddRidePage.tsx
 *
 * Created by Zander Otavka on 8/7/17.
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
import { Link, RouteComponentProps } from "react-router-dom"
import { Button, IconButton } from "react-toolbox/lib/button"
import classnames from "classnames"
import { Form } from "react-form"
import querystring from "querystring"

import Nav from "./Nav"
import * as routes from "../constants/routes"
import { RideSearchModel } from "../store/rides"

import styles from "./AddRidePage.sass"

import BackSVG from "../drawables/arrow-left.svg"

export interface Props extends RouteComponentProps<{}> {}

function AddRidePage(props: Props) {
  const query: RideSearchModel = {
    mode: "request",
    ...querystring.parse(
      props.location.search.substring(1) // chop off the leading ?
    ),
  }

  return (
    <Form component={false}>
      {({ submitForm }: any) =>
        <form
          className={classnames(styles.page, styles[query.mode])}
          action={routes.ride.root}
          method="post"
          onSubmit={ev => {
            ev.preventDefault()
            submitForm()
          }}
        >
          <header className={styles.header}>
            <Link
              to={
                query.arriveLocation !== undefined ||
                query.departLocation !== undefined
                  ? routes.ridesList.search(query)
                  : routes.ridesList.root(query.mode)
              }
            >
              <IconButton icon={<BackSVG className={styles.backIcon} />} />
            </Link>

            <span className={styles.headerTitle}>New Ride</span>

            <Button className={styles.createButton} type="submit">
              Create
            </Button>
          </header>

          <main className={styles.main} />

          <footer className={styles.footer}>
            <Nav />
          </footer>
        </form>}
    </Form>
  )
}

export default AddRidePage
