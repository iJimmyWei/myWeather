import { Component } from '@angular/core';
import { WeatherApiService} from './weather-api.service';
import { SearchService } from './search.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
  
})

export class AppComponent {
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];

  mWeatherData: Array<any>;
  mWeatherDataF = {
    dayA: [],
    dayB: [],
    dayC: [],
    dayD: [],
    dayE: []
  }

  constructor(private weatherapi: WeatherApiService,
              private searchapi: SearchService){}

  title = "myWeather";
  celsius = true;

  cityList: Array<any>;
  searchEntry = '';
  searchResult: Array<any>;
  
  ngOnInit(){
    this.weatherapi.getWeather().subscribe((data : any[]) => {
      this.mWeatherData = data;

      console.log(this.mWeatherDataF);

      // Categorise all the data into each day
      // But each day is relative to current time now
      for (let i in this.mWeatherData['list']){
        data = this.mWeatherData['list'][i];
    
        if (Number(i) >= this.mWeatherData['list'].length - 8){
          this.mWeatherDataF.dayE.push(data);
        }
        else if (Number(i) >= this.mWeatherData['list'].length - 16){
          this.mWeatherDataF.dayD.push(data);
        }
        else if (Number(i) >= this.mWeatherData['list'].length - 24){
          this.mWeatherDataF.dayC.push(data);
        }
        else if (Number(i) >= this.mWeatherData['list'].length - 32){
          this.mWeatherDataF.dayB.push(data);
        }
        else{
          this.mWeatherDataF.dayA.push(data);
        }
      
      }
    });

    this.searchapi.getCityList().subscribe((data : any[]) => {
      console.log('City data loaded');
      this.cityList = data;
    });
  }

  searchCityId(city){
    // Only initialize the search after 2 letters have been put in
    if (city.length > 1){
      let temporaryArray = [];
      this.searchResult = this.cityList.filter(function(data) {
        if (data['name'].toLowerCase().indexOf(city) !== -1){
          // GB Countries for now
          if (data['country'] == 'GB'){
            return true;
          }
        }
      });
      console.log(this.searchResult);
    }
    else{
      this.searchResult.length = 0;
    }
  }

  getCityId(){
    return [this.weatherapi.cityId];
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

  getOrdinalSuffix(number){
    var suffixes = ["th", "st", "nd", "rd"];
    var relevantDigits = (number < 30) ? number % 20 : number % 30;
    return (relevantDigits <= 3) ? suffixes[relevantDigits] : suffixes[0];
  }

  getDayLabel(day, isFirst){
    if (isFirst){
      return 'Today';
    }
    else{
      let utcDate = new Date(day.value[0].dt * 1000);
      let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days[utcDate.getUTCDay()] + ' ' + utcDate.getUTCDate() + this.getOrdinalSuffix(utcDate.getUTCDate());
    }
  }

  // Convert between fahrenheit and celsius
  getTemperature(data){
    // Default in API is Kelvin
    let temperature = data['temp'];

    if (this.celsius){
      return Math.floor(temperature - 273.15) + '°';
    }

    return temperature;
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

}