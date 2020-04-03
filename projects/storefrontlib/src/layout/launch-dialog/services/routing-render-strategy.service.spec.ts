import { TestBed } from '@angular/core/testing';
import { RoutingService } from '@spartacus/core';
import { LaunchConfig, LaunchRoute, LAUNCH_CALLER } from '../config/index';
import { RoutingRenderStrategy } from './routing-render-strategy.service';

const mockLaunchConfig: LaunchConfig = {
  launch: {
    TEST_URL: {
      default: {
        cxRoute: 'url',
      },
    },
    TEST_URL_PARAMS: {
      default: {
        cxRoute: 'url',
        params: ['test'],
      },
    },
    TEST_OUTLET: {
      default: {
        outlet: 'cx-outlet-test',
        component: {},
      },
    },
  },
};

class MockRoutingService {
  go() {}
}

describe('RoutingRenderStrategy', () => {
  let service: RoutingRenderStrategy;
  let routingService: RoutingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RoutingRenderStrategy,
        { provide: RoutingService, useClass: MockRoutingService },
      ],
    });

    service = TestBed.get(RoutingRenderStrategy);
    routingService = TestBed.get(RoutingService);

    spyOn(routingService, 'go');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('render', () => {
    it('should call RoutingService go', () => {
      const config = mockLaunchConfig.launch['TEST_URL'].default as LaunchRoute;

      service.render(config, 'TEST_URL' as LAUNCH_CALLER);

      expect(routingService.go).toHaveBeenCalledWith({
        cxRoute: config.cxRoute,
      });
    });

    it('should include params', () => {
      const config = mockLaunchConfig.launch['TEST_URL_PARAMS']
        .default as LaunchRoute;

      service.render(config, 'TEST_URL_PARAMS' as LAUNCH_CALLER);

      expect(routingService.go).toHaveBeenCalledWith({
        cxRoute: config.cxRoute,
        params: config.params,
      });
    });
  });

  describe('match', () => {
    it('should return TRUE for an inline config', () => {
      const config = mockLaunchConfig.launch['TEST_URL'].default as LaunchRoute;
      expect(service.match(config)).toBeTruthy();
    });

    it('should return FALSE for a different config', () => {
      const config = mockLaunchConfig.launch['TEST_OUTLET']
        .default as LaunchRoute;
      expect(service.match(config)).toBeFalsy();
    });
  });
});
