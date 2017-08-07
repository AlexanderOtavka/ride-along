/**
 * @file registerServiceWorker.tsx
 *
 * Created by Zander Otavka on 6/2/17.
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

/**
 * In production, we register a service worker to serve assets from local cache.
 *
 * This lets the app load faster on subsequent visits in production, and gives
 * it offline capabilities. However, it also means that developers (and users)
 * will only see deployed updates on the "N+1" visit to a page, since previously
 * cached resources are updated in the background.
 *
 * To learn more about the benefits of this model, read https://goo.gl/KwvDNy.
 * This link also includes instructions on opting out of this behavior.
 */
export default function register() {
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`
      navigator.serviceWorker
        .register(swUrl)
        .then(registration => {
          registration.onupdatefound = () => {
            const installingWorker = registration.installing
            if (!installingWorker) {
              return
            }

            installingWorker.onstatechange = () => {
              if (installingWorker.state === "installed") {
                if (navigator.serviceWorker.controller) {
                  // At this point, the old content will have been purged and
                  // the fresh content will have been added to the cache.
                  // It's the perfect time to display a "New content is
                  // available; please refresh." message in your web app.
                  // tslint:disable-next-line
                  console.log("New content is available; please refresh.")
                } else {
                  // At this point, everything has been precached.
                  // It's the perfect time to display a
                  // "Content is cached for offline use." message.
                  // tslint:disable-next-line
                  console.log("Content is cached for offline use.")
                }
              }
            }
          }
        })
        .catch(error => {
          console.error("Error during service worker registration:", error) // tslint:disable-line
        })
    })
  }
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister()
    })
  }
}
