import {Component, OnInit} from '@angular/core';
import {CurrencyService} from '@app/service/currency.service';
import {Rate} from '@app/model/rate';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public exchangeRates: Map<string, Rate>;

  constructor(private currencyService: CurrencyService) {
    this.exchangeRates = new Map();
  }

  ngOnInit() {
    this.currencyService.fetchExchangeRates().subscribe(() => {
      this.exchangeRates = this.currencyService.exchangeRates;
    });
  }
}
