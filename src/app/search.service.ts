import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SearchService {
  localJsonPath = "assets/city.list.json";

  constructor(private http:HttpClient) { 
  }

  public getCityList(): Observable<any>{
    return this.http.get(this.localJsonPath);
  }
}
