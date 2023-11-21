import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {MainModule} from '@app/components/main/main.module';
import {CurrencyService} from '@app/service/currency.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MainModule.forRoot()
  ],
  providers: [CurrencyService],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
