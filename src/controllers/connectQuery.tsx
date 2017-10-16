/**
 * @file connectQuery.tsx
 *
 * Created by Zander Otavka on 8/14/17.
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
import getDisplayName from "react-display-name"
import querystring from "querystring"
import { RouteComponentProps } from "react-router-dom"

export interface QueryComponentProps<TRouteParams, TQuery>
  extends RouteComponentProps<TRouteParams> {
  query: TQuery
  setQuery: (newQuery: any) => void
}

export default function connectQuery<
  TQuery,
  TRouteParams,
  TProps extends RouteComponentProps<TRouteParams>
>(pick: (query: any, props: TProps) => TQuery) {
  return (
    Component: React.ComponentType<QueryComponentProps<TRouteParams, TQuery>>
  ) =>
    class ConnectQuery extends React.Component<TProps> {
      static displayName = `ConnectQuery(${getDisplayName(Component)})`

      setQuery = (newQuery: any) => {
        this.props.history.replace(
          "?" + querystring.stringify(pick(newQuery, this.props))
        )
      }

      render() {
        const query = pick(
          querystring.parse(
            this.props.location.search.substring(1) // chop off the leading ?
          ),
          this.props
        )

        return (
          <Component {...this.props} query={query} setQuery={this.setQuery} />
        )
      }
    }
}
