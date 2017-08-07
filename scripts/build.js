/**
 * @file build.js
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

import path from "path"
import chalk from "chalk"
import fs from "fs-extra"
import webpack from "webpack"
import checkRequiredFiles from "react-dev-utils/checkRequiredFiles"
import formatWebpackMessages from "react-dev-utils/formatWebpackMessages"
import printHostingInstructions from "react-dev-utils/printHostingInstructions"
import {
  measureFileSizesBeforeBuild,
  printFileSizesAfterBuild,
} from "react-dev-utils/FileSizeReporter"

import paths from "../config/paths"

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", err => {
  throw err
})

// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = "production"

// Ensure environment variables are read.
require("../config/env")

// We have to use require because imports are evaluated before this module is
// executed and NODE_ENV is set.
const config = require("../config/webpack.config").default

// Check for yarn.lock
const useYarn = fs.existsSync(paths.yarnLockFile)

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1)
}

// First, read the current file sizes in build directory.
// This lets us display how much they changed later.
measureFileSizesBeforeBuild(paths.appBuild)
  .then(previousFileSizes => {
    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    fs.emptyDirSync(paths.appBuild)
    // Merge with the public folder
    copyPublicFolder()
    // Start the webpack build
    return build(previousFileSizes)
  })
  .then(({ stats, previousFileSizes, warnings }) => {
    if (warnings.length) {
      console.warn(chalk.yellow("Compiled with warnings.\n"))
      console.warn(warnings.join("\n\n"))
      console.warn(
        "\nSearch for the " +
          chalk.underline(chalk.yellow("keywords")) +
          " to learn more about each warning."
      )
      console.warn(
        "To ignore, add " +
          chalk.cyan("// eslint-disable-next-line") +
          " to the line before.\n"
      )
    } else {
      console.info(chalk.green("Compiled successfully.\n"))
    }

    console.info("File sizes after gzip:\n")
    printFileSizesAfterBuild(stats, previousFileSizes, paths.appBuild)
    console.info()

    const appPackage = require(paths.appPackageJson)
    const publicUrl = paths.publicUrl
    const publicPath = config.output.publicPath
    const buildFolder = path.relative(process.cwd(), paths.appBuild)
    printHostingInstructions(
      appPackage,
      publicUrl,
      publicPath,
      buildFolder,
      useYarn
    )

    if (process.env.CI) {
      // We have to manually kill in CI mode since the bundle analyzer will want
      // to open the report in the browser.  When not in CI mode, we shouldn't
      // kill because it prevents the report from opening.
      process.exit(0)
    }
  })
  .catch(err => {
    console.error(chalk.red("Failed to compile.\n"))
    console.error(err + "\n")
    process.exit(1)
  })

// Create the production build and print the deployment instructions.
function build(previousFileSizes) {
  console.info("Creating an optimized production build...")

  let compiler = webpack(config)
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err)
      }

      const messages = formatWebpackMessages(stats.toJson({}, true))
      if (messages.errors.length) {
        return reject(new Error(messages.errors.join("\n\n")))
      }

      if (process.env.CI && messages.warnings.length) {
        console.warn(
          chalk.yellow(
            "\nTreating warnings as errors because process.env.CI = true.\n" +
              "Most CI servers set it automatically.\n"
          )
        )
        return reject(new Error(messages.warnings.join("\n\n")))
      }

      return resolve({
        stats,
        previousFileSizes,
        warnings: messages.warnings,
      })
    })
  })
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  })
}
