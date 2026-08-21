export type WeatherSnapshot = {
  location: string;
  temperatureC: number;
  rainChance: number;
  humidity: number;
  windKph: number;
};

export interface WeatherService {
  current(location: string): Promise<WeatherSnapshot | null>;
}

export class OptionalWeatherService implements WeatherService {
  async current(): Promise<null> {
    return null;
  }
}
