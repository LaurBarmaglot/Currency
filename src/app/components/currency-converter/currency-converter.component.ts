import {
  Component,
  ElementRef, OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import {CurrencyService} from '@app/service/currency.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {customRequired, rateValidator} from '@app/service/validators';
import {Rate} from '@app/model/rate';

const DELAY = 750;

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CurrencyConverterComponent implements OnInit {

  @ViewChildren('amountInput', {read: ElementRef}) amountInputs!: QueryList<ElementRef>;

  @ViewChild('swapButton', {static: true}) swapButton!: ElementRef;

  public exchangeRates: Map<string, Rate>;

  currenciesImages: string[] = ['./assets/uah/image.png', './assets/usd/image.png', './assets/eur/image.png'];

  secondCurrency: string = 'USD';

  firstCurrency: string = 'UAH';

  indexSecond: number = 1;

  secondAmount: number = 1;

  firstAmount: number = 1;

  indexFirst: number = 1;

  currencies: string[];

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private currencyService: CurrencyService) {
    this.currencies = ['UAH', 'USD', 'EUR'];
    this.exchangeRates = new Map();
    this.form = this.fb.group({
      rate: ['', [customRequired, rateValidator()]]
    });
  }

  ngOnInit(): void {
    this.currencyService.fetchExchangeRates().subscribe(() => {
      this.exchangeRates = this.currencyService.exchangeRates;
      this.secondAmount = this.convert(this.firstAmount, this.secondCurrency, this.firstCurrency);
    });
  }

  convert(amount: number, fromCurrency: string, toCurrency: string): number {
    const firstRate = this.exchangeRates.get(fromCurrency)?.rate ?? 1;
    const secondRate = this.exchangeRates.get(toCurrency)?.rate ?? 1;
    if (firstRate && secondRate) {
      return this.truncateNumber(amount * firstRate / secondRate, 4);
    } else {
      console.error('Rates for the currencies do not exist');
      return 0;
    }
  }

  onFirstCurrencyChange(): void {
    this.secondAmount = this.convert(this.firstAmount, this.firstCurrency, this.secondCurrency);
  }

  onSecondCurrencyChange(): void {
    this.firstAmount = this.convert(this.secondAmount, this.secondCurrency, this.firstCurrency);
  }


  truncateNumber(value: number, decimals: number): number {
    const multiplier = Math.pow(10, decimals);
    return Math.floor(value * multiplier) / multiplier;
  }

  onSwapClick() {
    this.swapSelect();
    const inputs: ElementRef<HTMLInputElement>[] =
      this.amountInputs.toArray() as ElementRef<HTMLInputElement>[];
    this.swapInputs(inputs);
    this.delaySwap(inputs);
  }

  getFlagImageUrl(currency: string): string {
    const index = this.currencies.indexOf(currency);
    if (index !== -1 && index < this.currenciesImages.length) {
      return this.currenciesImages[index];
    }
    return '';
  }

  swapCurrencies(isFirst: boolean) {
    if (isFirst) {
      this.indexFirst = (this.indexFirst + 1) % this.currencies.length;
      this.firstCurrency = this.currencies[this.indexFirst];
    } else {
      this.indexSecond = (this.indexSecond + 1) % this.currencies.length;
      this.secondCurrency = this.currencies[this.indexSecond];
    }
    this.secondAmount = this.convert(this.firstAmount, this.firstCurrency, this.secondCurrency);
    this.firstAmount = this.convert(this.secondAmount, this.secondCurrency, this.firstCurrency);
  }

  private delaySwap(inputs: ElementRef<HTMLInputElement>[]) {
    setTimeout(() => {
      if (inputs.length > 1) {
        const tempValue = inputs[0].nativeElement.value;
        inputs[0].nativeElement.value = inputs[1].nativeElement.value;
        inputs[1].nativeElement.value = tempValue;
      }
    }, DELAY);
  }

  private swapInputs(inputs: ElementRef<HTMLInputElement>[]) {
    const elementsToAnimate: ElementRef<HTMLElement>[] = [
      this.swapButton.nativeElement,
      ...inputs.map(input => input.nativeElement)
    ] as ElementRef<HTMLInputElement>[];

    elementsToAnimate.forEach(e =>
      this.renderer.removeClass(e, 'animate'));

    setTimeout(() => {
      elementsToAnimate.forEach(e =>
        this.renderer.addClass(e, 'animate'));
    }, 0);
  }

  private swapSelect() {
    const temp = this.firstCurrency;
    this.firstCurrency = this.secondCurrency;
    this.secondCurrency = temp;
  }
}
