import { Inject, Injectable, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { BreakpointService } from '../../breakpoint/breakpoint.service';
import {
  LaunchConfig,
  LaunchOptions,
  LAUNCH_CALLER,
} from '../config/launch-config';
import { LaunchRenderStrategy } from './launch-render.strategy';

@Injectable({ providedIn: 'root' })
export class LaunchDialogService {
  // Keep a list of rendered elements
  protected renderedCallers: LAUNCH_CALLER[] = [];

  constructor(
    @Inject(LaunchRenderStrategy)
    protected renderStrategies: LaunchRenderStrategy[],
    protected launchConfig: LaunchConfig,
    protected breakpointService: BreakpointService
  ) {
    this.renderStrategies = this.renderStrategies || [];
  }

  /**
   * Render the element based on the strategy from the launch configuration
   *
   * @param caller LAUNCH_CALLER
   * @param vcr View Container Ref of the container for inline rendering
   */
  launch(caller: LAUNCH_CALLER, vcr?: ViewContainerRef): void {
    this.findConfiguration(caller).subscribe((config) => {
      const renderer = this.getStrategy(config);

      // Render if the strategy exists
      if (renderer) {
        renderer.render(config, caller, vcr);
      }
    });
  }

  /**
   * Util method to remove element from rendered elements list
   *
   * @param caller LAUNCH_CALLER
   */
  clear(caller: LAUNCH_CALLER): void {
    this.findConfiguration(caller).subscribe((config) => {
      const renderer = this.getStrategy(config);

      // Render if the strategy exists
      if (renderer) {
        renderer.remove(caller, config);
      }
    });
  }

  /**
   * Returns the configuration for the caller
   *
   * @param caller LAUNCH_CALLER
   */
  protected findConfiguration(
    caller: LAUNCH_CALLER
  ): Observable<LaunchOptions> {
    return this.breakpointService.breakpoint$.pipe(
      distinctUntilChanged(),
      map((breakpoint) =>
        this.launchConfig?.launch[caller][breakpoint]
          ? this.launchConfig?.launch[caller][breakpoint]
          : this.launchConfig?.launch[caller].default
      )
    );
  }

  /**
   * Returns the render strategy based on the configuration
   *
   * @param config Configuration for launch
   */
  protected getStrategy(config: LaunchOptions): LaunchRenderStrategy {
    return this.renderStrategies.find((strategy) => strategy.match(config));
  }
}
