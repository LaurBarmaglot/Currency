import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {nbuUrl} from '../../../config';
import {Rate} from '@app/model/rate';

@Injectable()
export class CurrencyService {

  private readonly _exchangeRates: Map<string, Rate>;

  private indexSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {
    this._exchangeRates = new Map();
    this.fetchExchangeRates().subscribe();
  }

  fetchExchangeRates(): Observable<Rate[]> {
    return this.http.get<Rate[]>(nbuUrl).pipe(
      map(data => this.filterAndMapExchangeRates(data))
    );
  }

  get exchangeRates(): Map<string, Rate> {
    return this._exchangeRates;
  }

  filterAndMapExchangeRates(data: Rate[]): Rate[] {
    const filteredData = data.filter(
      rate => rate.cc === 'USD' || rate.cc === 'EUR');
    filteredData.forEach(rate => {
      this._exchangeRates.set(rate.cc, rate);
    });
    return filteredData;
  }

  updateIndex(newIndex: number): void {
    this.indexSubject.next(newIndex);
  }
}
