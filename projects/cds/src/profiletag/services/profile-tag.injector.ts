import { Injectable } from '@angular/core';
import { merge, Observable } from 'rxjs';
import { mapTo, switchMap, tap } from 'rxjs/operators';
import {
  CartChangedPushEvent,
  ConsentChangedPushEvent,
  NavigatedPushEvent,
} from '../model';
import { ProfileTagEventTracker } from './profiletag-events';
import { SpartacusEventTracker } from './spartacus-events';

@Injectable({
  providedIn: 'root',
})
export class ProfileTagInjector {
  private profileTagEvents$ = this.profileTagEventTracker.getProfileTagEvent();
  private injectionsEvents$: Observable<boolean> = merge(
    this.notifyProfileTagOfConsentGranted(),
    this.notifyProfileTagOfCartChange(),
    this.notifyProfileTagOfPageLoaded()
  );

  constructor(
    private profileTagEventTracker: ProfileTagEventTracker,
    private spartacusEventTracker: SpartacusEventTracker
  ) {}

  track(): Observable<boolean> {
    return this.profileTagEventTracker.addTracker().pipe(
      switchMap(_ => merge(this.injectionsEvents$, this.profileTagEvents$)),
      mapTo(true)
    );
  }

  notifyProfileTagOfConsentGranted(): Observable<boolean> {
    return this.spartacusEventTracker.consentGranted().pipe(
      tap(granted => {
        this.profileTagEventTracker.notifyProfileTagOfEventOccurence(
          new ConsentChangedPushEvent(granted)
        );
      })
    );
  }

  notifyProfileTagOfCartChange(): Observable<boolean> {
    return this.spartacusEventTracker.cartChanged().pipe(
      tap(([entries, cart]) => {
        this.profileTagEventTracker.notifyProfileTagOfEventOccurence(
          new CartChangedPushEvent({ entries, cart })
        );
      }),
      mapTo(true)
    );
  }

  notifyProfileTagOfPageLoaded(): Observable<boolean> {
    return this.spartacusEventTracker.navigated().pipe(
      tap(_ => {
        this.profileTagEventTracker.notifyProfileTagOfEventOccurence(
          new NavigatedPushEvent()
        );
      })
    );
  }
}
