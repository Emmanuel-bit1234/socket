import {Injectable, InjectionToken, Injector} from '@angular/core';
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal, PortalInjector} from '@angular/cdk/portal';
import {LogService} from '@app/core/log.service';
import {Observable} from 'rxjs';
import {delay, finalize, map, switchMap} from 'rxjs/operators';
import {SPIN_DATA, SpinComponent} from './spin.component';
import {of} from 'rxjs/internal/observable/of';

@Injectable()
export class SpinService {
  constructor(
    private log: LogService,
    private injector: Injector,
    private overlay: Overlay
  ) {
    log.construct(this.constructor.name);
  }

  private create(backdrop?: boolean) {
    return this.overlay.create({
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      hasBackdrop: backdrop
    });
  }

  private attach(ref: OverlayRef, text?: string): OverlayRef {
    ref.attach(new ComponentPortal(
      SpinComponent,
      null,
      new PortalInjector(
        this.injector,
        new WeakMap<InjectionToken<{ text: string }>, { text: string }>([
          [SPIN_DATA, {text}]
        ])
      )
    ));
    return ref;
  }

  ref(text?: string, backdrop?: boolean): OverlayRef {
    return this.attach(this.create(backdrop), text);
  }

  defer(text?: string, backdrop?: boolean): Observable<OverlayRef> {
    return of(this.create(backdrop))
      .pipe(
        delay(0),
        map(next => this.attach(next, text))
      );
  }

  on<T>(source: Observable<T>, text?: string): Observable<T> {
    return this.defer(text, true)
      .pipe(
        switchMap(next => source.pipe(finalize(() => next.dispose())))
      );
  }

  wrap<T>(source: Promise<T>, text?: string): Promise<T> {
    return new Promise<OverlayRef>(resolve => {
      const ref = this.create(true);
      setTimeout(() => resolve(this.attach(ref, text)), 0);
    }).then(next => source.finally(() => next.dispose()));
  }
}
