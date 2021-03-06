import { Component } from '@angular/core';
import { WeatherApiService} from './weather-api.service';
import { SearchService } from './search.service';
import {FormControl} from '@angular/forms';
import { HostListener } from "@angular/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
  
})

export class AppComponent {
  constructor(private weatherapi: WeatherApiService,
              private searchapi: SearchService){
                this.getScreenSize();
              }

  // Initialize variables
  myControl = new FormControl();

  mWeatherData: Array<any>;
  mWeatherDataF = {
    dayA: [],
    dayB: [],
    dayC: [],
    dayD: [],
    dayE: []
  }
  celsius = true;
  searchEntry = '';
  cityList: Array<any>;
  searchResult: Array<any>;

  screenHeight:any;
  screenWidth:any;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
        this.screenHeight = window.innerHeight;
        this.screenWidth = window.innerWidth;
  }

  getTitleCityName(){
    if (this.mWeatherData == undefined){
      return "No City Selected";
    }
    else if (this.mWeatherData.hasOwnProperty('city')){
      // Add a '-' if it's a non mobile device
      if (this.screenWidth < 480){
        return this.mWeatherData['city']['name'] + ', ' + 
        this.mWeatherData['city']['country'];
      }
      else{
        return ' - ' + this.mWeatherData['city']['name'] + ', ' + 
                this.mWeatherData['city']['country'];
      }
    }
  }

  switchTemperatures(){
    if (this.celsius){
      this.celsius = false;
    }
    else{
      this.celsius = true;
    }
  }

  getTemperatureConversionLabel(){
    if (this.celsius){
      return 'celsius';
    }
    else{
      return 'fahrenheit';
    }
  }

  ngOnInit(){
    this.loadWeather();
  }

  resetFilteredData(){

    this.mWeatherDataF = {
      dayA: [],
      dayB: [],
      dayC: [],
      dayD: [],
      dayE: []
    }
  }

  loadWeather(){
    this.resetFilteredData();

    this.weatherapi.getWeather().subscribe((data : any[]) => {
      this.mWeatherData = data;

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
      this.cityList = data;
    });
  }
  
  searchCityId(city){
    // Check if the city has become an object with an ID
    if (city.hasOwnProperty('id')){
      this.weatherapi.cityId = city.id;
      this.loadWeather();
    }

    // Only initialize the search after 4 letters have been put in
    if (city.length > 3){
      this.searchResult = this.cityList.filter(function(data) {
        if (data['name'].toLowerCase().indexOf(city.toLowerCase()) !== -1){
          return true;
        }
      });
    }
    else{
      if (this.searchResult !== undefined){
        this.searchResult.length = 0;
      }
    }
  }

  displayFn(obj){
    if (obj == undefined){
      return;
    }

    if (obj.hasOwnProperty('name'))
    {
      return obj.name + ', ' + obj.country;
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
      if (day.value[0] == undefined){
        return;
      }

      let utcDate = new Date(day.value[0].dt * 1000);
      let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days[utcDate.getUTCDay()] + ' ' + utcDate.getUTCDate() + this.getOrdinalSuffix(utcDate.getUTCDate());
    }
  }
}