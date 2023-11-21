import {ModuleWithProviders, NgModule} from '@angular/core';
import {NBU_URL_TOKEN, nbuUrl} from '../../../../config';
import {HeaderComponent} from '@app/components/header/header.component';
import {MainComponent} from '@app/components/main/main.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgForOf, NgOptimizedImage} from '@angular/common';
import {
  CurrencyConverterComponent
} from '@app/components/currency-converter/currency-converter.component';

@NgModule({
  declarations: [
    HeaderComponent,
    CurrencyConverterComponent,
    MainComponent
  ],
  exports: [
    MainComponent
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    NgForOf,
    NgOptimizedImage
  ]
})
export class MainModule {
  public static forRoot(): ModuleWithProviders<MainModule> {
    return {
      ngModule: MainModule,
      providers: [
        {
          provide: NBU_URL_TOKEN,
          useValue: nbuUrl
        }
      ]
    };
  }

  public static forChild(): ModuleWithProviders<MainModule> {
    return {
      ngModule:
      MainModule
    };
  }
}
