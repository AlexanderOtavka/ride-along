/**
 * @file check-lighthouse.js
 *
 * Created by Zander Otavka on 6/28/17.
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

const EXIT_OK = 0
const EXIT_NO_FILE = 1
const EXIT_LOW_SCORE = 2
const EXIT_ERROR = 3

if (process.argv.length < 3) {
  console.error("File not provided")
  process.exit(EXIT_NO_FILE)
}

try {
  const path = process.argv[2]
  const data = JSON.parse(fs.readFileSync(path))
  const score = Math.round(data.score)

  console.info(`Lighthouse score: ${score}%`)

  const SCORE_THRESHOLD = 80
  if (score < SCORE_THRESHOLD) {
    console.warn(`Unacceptable score below ${SCORE_THRESHOLD}%.  See report:`)
    console.warn(JSON.stringify(data.reportCategories, null, 2))
    process.exit(EXIT_LOW_SCORE)
  }

  process.exit(EXIT_OK)
} catch (e) {
  console.error(e)
  process.exit(EXIT_ERROR)
}
