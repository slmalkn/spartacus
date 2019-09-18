import { StateLoaderActions } from '../../../../state/utils/index';
import { CONFIGURATION_DATA } from '../configuration-state';

export const CREATE_CONFIGURATION = '[Configurator] Create Configuration';
export const CREATE_CONFIGURATION_FAIL =
  '[Configurator] Create Configuration Fail';
export const CREATE_CONFIGURATION_SUCCESS =
  '[Configurator] Create Configuration Sucess';

export class CreateConfiguration extends StateLoaderActions.LoaderLoadAction {
  readonly type = CREATE_CONFIGURATION;

  constructor(public payload: any) {
    super(CONFIGURATION_DATA);
  }
}

export class CreateConfigurationFail extends StateLoaderActions.LoaderFailAction {
  readonly type = CREATE_CONFIGURATION_FAIL;
  constructor(public payload: any) {
    super(CONFIGURATION_DATA, payload);
  }
}

export class CreateConfigurationSuccess extends StateLoaderActions.LoaderSuccessAction {
  readonly type = CREATE_CONFIGURATION_SUCCESS;
  constructor(public payload: any) {
    super(CONFIGURATION_DATA);
  }
}

export type ConfiguratorAction =
  | CreateConfiguration
  | CreateConfigurationFail
  | CreateConfigurationSuccess;
