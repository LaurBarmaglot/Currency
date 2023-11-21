import {InjectionToken} from '@angular/core';
import {environment} from './environments/environment';

export const nbuUrl: string = environment.nbuUrl;
export const NBU_URL_TOKEN: InjectionToken<string> = new InjectionToken('NBU_URL');
