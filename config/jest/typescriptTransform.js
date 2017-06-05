/**
 * @file typescriptTransform.js
 *
 * Created by Zander Otavka on 6/4/17.
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

import fs from "fs"
import tsc from "typescript"
import appRootPath from "app-root-path"

const tsconfigPath = appRootPath.resolve("/tsconfig.json")

let compilerConfig = {
  module: tsc.ModuleKind.CommonJS,
  jsx: tsc.JsxEmit.React,
}

if (fs.existsSync(tsconfigPath)) {
  try {
    const tsconfig = require(tsconfigPath)

    if (tsconfig && tsconfig.compilerOptions) {
      compilerConfig = tsconfig.compilerOptions
    }
  } catch (e) {
    // The default is set, just warn.
    console.warn(e)
  }
}

export function process(src, path) {
  if (path.endsWith(".ts") || path.endsWith(".tsx")) {
    return tsc.transpile(src, compilerConfig, path, [])
  } else {
    return src
  }
}
