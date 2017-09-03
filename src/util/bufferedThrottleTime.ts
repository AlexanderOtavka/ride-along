/**
 * @file bufferedThrottleTime.ts
 *
 * Created by Zander Otavka on 8/24/17.
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

import { Observable } from "rxjs/Observable"
import { Scheduler } from "rxjs/Scheduler"
import { async } from "rxjs/scheduler/async"
import { Operator } from "rxjs/Operator"
import { Subscriber } from "rxjs/Subscriber"
import { Subscription } from "rxjs/Subscription"

class BufferedThrottleTimeSubscriber<T> extends Subscriber<T> {
  private hasBufferedValue = false
  private bufferedValue: T | null = null
  private throttleSubscription: Subscription | null = null

  constructor(
    destination: Subscriber<T>,
    private duration: number,
    private scheduler: Scheduler
  ) {
    super(destination)
  }

  next(value: T) {
    if (this.throttleSubscription === null) {
      this.throttleSubscription = this.scheduler.schedule(
        this.clearThrottle,
        this.duration
      )

      this.add(this.throttleSubscription)

      if (this.destination.next) {
        this.destination.next(value)
      }
    } else {
      this.bufferedValue = value
      this.hasBufferedValue = true
    }
  }

  clearThrottle = () => {
    if (this.throttleSubscription) {
      this.throttleSubscription.unsubscribe()
      this.remove(this.throttleSubscription)
      this.throttleSubscription = null
    }

    if (this.hasBufferedValue && this.destination.next) {
      this.destination.next(this.bufferedValue)
      this.hasBufferedValue = false
    }
  }
}

class BufferedThrottleTimeOperator<T> implements Operator<T, T> {
  constructor(private duration: number, private scheduler: Scheduler) {}
  call(subscriber: Subscriber<T>, source: Observable<T>) {
    return source.subscribe(
      new BufferedThrottleTimeSubscriber(
        subscriber,
        this.duration,
        this.scheduler
      )
    )
  }
}

export default function bufferedThrottleTime(
  duration: number,
  scheduler: Scheduler = async
) {
  return <T>(source: Observable<T>) =>
    source.lift(new BufferedThrottleTimeOperator<T>(duration, scheduler))
}
