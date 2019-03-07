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
  
  getWeatherPosition(dt){
    let utcDate = new Date(dt.dt * 1000);
    let hour = utcDate.getUTCHours();

    // Definitions of morning, afternoon, evening and night
    if (hour < 7 || hour > 22){
      return 'weather_night_pos';
    }
    else if (hour < 12){
      return 'weather_morning_pos';
    }
    else if (hour < 15){
      return 'weather_afternoon_pos';
    }
    else{
      return 'weather_evening_pos';
    }
  }
  
  getWeatherIcon(data){
    let weatherId = data.weather[0].id;
    return 'wi wi-owm-' + weatherId;
  }

  getRainChance(data){
    let chance = 0;

    if (data.hasOwnProperty("3h")){
      let mmPrecip = data['3h'];

      // Light rain called
      if (mmPrecip < 7){
        chance = mmPrecip * 20 + 30;
      }
      else if (mmPrecip < 14){
        chance = (mmPrecip * 20) + 40;
      }
      else{
        chance = (mmPrecip * 30) + 50;
      }

      if (chance > 100){
        chance = 100;
      }
    }

    return Math.floor(chance) + '%';
  }

  // Return in celsius by default
  getTemperature(data, useCelsius = true){
    // Default in API is Kelvin
    let kelvin = data['temp'];

    if (useCelsius){
      return Math.floor(kelvin - 273.15) + '°';
    }
    else{
      return Math.floor((kelvin - 273.15) * 9/5 + 32) + '°F';
    }
  }
}
