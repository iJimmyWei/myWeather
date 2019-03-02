import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherApiService {
  api_key = "12c1a65e9e65a88cc316b3f95eeefc35"; // Openweather API Key
  cityId = "2643743"; // London

  constructor(private http:HttpClient) { 
  }
  
  getWeather(){
    return this.http.get('http://api.openweathermap.org/data/2.5/forecast?id=' + this.cityId + '&APPID=' + this.api_key);
  }
}
