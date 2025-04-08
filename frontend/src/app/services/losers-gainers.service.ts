import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {BigChanger} from "../models/losers-gainers.model";

@Injectable({
  providedIn: 'root'
})
export class LosersGainersService{
  private apiUrl = "http://127.0.0.1:8000/stocks/"
  constructor(private http: HttpClient) {}

  getLosers(): Observable<BigChanger[]> {
    return this.http.get<BigChanger[]>(this.apiUrl + "losers")
  }

  getWinners(): Observable<BigChanger[]>{
    return this.http.get<BigChanger[]>(this.apiUrl + "gainers")
  }
}
