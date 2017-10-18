/**
 * @file watchProp.tsx
 *
 * Created by Zander Otavka on 8/15/17.
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
import lodashIsEqual from "lodash/isEqual"

export default function watchProp<TProps, TProp>(
  getProp: (props: TProps) => TProp,
  onChange: (newProp: TProp, oldProp: TProp | null, props: TProps) => void,
  isEqual: (a: TProp, b: TProp) => boolean = lodashIsEqual
) {
  return (Component: React.ComponentType<TProps>) =>
    class WatchProp extends React.Component<TProps> {
      componentDidMount() {
        onChange(getProp(this.props), null, this.props)
      }

      componentWillReceiveProps(nextProps: TProps) {
        const oldProp = getProp(this.props)
        const newProp = getProp(nextProps)
        if (!isEqual(newProp, oldProp)) {
          onChange(newProp, oldProp, nextProps)
        }
      }

      render() {
        return <Component {...this.props} />
      }
    }
}
