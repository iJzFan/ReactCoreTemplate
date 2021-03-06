import { match } from 'react-router';
import { HttpClient } from '../../services';
import { service, state, reducer, effect, location } from '@banbrick/redux-creator';
import { httpConfigService } from '@services';

export class WatherForecastState {
  forecasts: any[] = [];
  loading: boolean = false;
  index: number = 0;
  error?: Error;
}

@service('watherForecast')
export class WatherForecastService {
  @state
  state = new WatherForecastState();

  @reducer
  setForecasts(forecasts: Array<any>, index: number) {
    return { ...this.state, forecasts, index };
  }

  @reducer
  setLoading(loading: boolean) {
    return { ...this.state, loading };
  }

  async loadingPipe(action: Promise<any>) {
    this.setLoading(true);
    this.state.error = undefined;
    
    try {
      return await action
    } catch(e) {
      this.state.error = e;
    }
    finally {
      this.setLoading(false);
    }
  }

  @effect
  async loadWeatherForecast(index: number) {
    const httpClient = new HttpClient(httpConfigService.config);
    const forecasts = await this.loadingPipe(httpClient.get(`/api/SampleData/WeatherForecasts?startDateIndex=${index}`));
    this.setForecasts(forecasts && forecasts.data, index)
  }

  @location('/weather-forecast/:index?', true)
  async loadOnWeatherUrl(matches: match<{ index?: string}>) {
    const index = parseInt(matches.params.index || '') || 0;
    await this.loadWeatherForecast(index);
  }
}