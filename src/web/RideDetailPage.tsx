/**
 * @file RideDetailPage.tsx
 *
 * Created by Zander Otavka on 8/17/17.
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
import { DispatchProp, connect } from "react-redux"
import { RouteComponentProps } from "react-router"

import { StateModel } from "../store/index"
import { compose } from "redux"

// import styles from "./RideDetailPage.sass"

interface StateProps {
  isCreating: boolean
}

interface DispatchProps extends DispatchProp<StateModel> {}

export interface Props extends RouteComponentProps<{ id: string }> {}

type AllProps = StateProps & DispatchProps & Props

const withController = compose(
  connect<StateProps, DispatchProps, Props>((state: StateModel) => ({
    isCreating: state.rides.isCreating,
  }))
)

function RideDetailPage(props: AllProps) {
  const { id } = props.match.params

  // TODO: make this page look nice
  return <div>Ride with id: {id}</div>
}

export default withController(RideDetailPage)
