import { Injectable } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { Observable } from "rxjs";

import {
  RefreshTokenEvent,
  RefreshTokenResposneEvent,
} from "src/interwork/events/interwork.event";
import { InterworkService } from "src/interwork/interwork.service";

@Injectable()
export class InterworkEventListener {
  constructor(
    private interworkService: InterworkService,
    private emitter: EventEmitter2
  ) {}

  @OnEvent(RefreshTokenEvent.Key, { async: true })
  async refreshTokenByOldToken(event: RefreshTokenEvent) {
    const { oldToken } = event;
    const newToken = await this.interworkService.refreshTokenByOldToken(
      oldToken
    );
    const obs$ = Observable.create((observer) => {
      this.emitter.on(RefreshTokenEvent.Key, (val) => observer.next(val));
      this.emitter.on("error", (err) => observer.error(err));
    });
  }
}
