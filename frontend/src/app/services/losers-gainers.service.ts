import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {LoserModel, WinnerModel} from "../models/losers-gainers.model";

@Injectable({
  providedIn: 'root'
})
export class LosersGainersService{
  private apiUrl = "http://127.0.0.1:8000/stocks/"
  constructor(private http: HttpClient) {}

  getLosers(): Observable<LoserModel[]> {
    return this.http.get<LoserModel[]>(this.apiUrl + "losers")
  }

  getWinners(): Observable<WinnerModel[]>{
    return this.http.get<WinnerModel[]>(this.apiUrl + "gainers")
  }
}
