import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


const baseUrl = "http://127.0.0.1:8000/api/all/search" ;
const searchAll = "http://127.0.0.1:8000/api/searchAll" ;
const search = "http://127.0.0.1:8000/api/searchByLabel" ;
const lastone = "http://127.0.0.1:8000/api/Search/AllItem" ;





@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }


  Search(data) {
    return this.http.get(baseUrl , data);
  }


  result(label){
    return this.http.get(`${lastone}/${label}`);
    // return this.http.put(`${baseUrl}/${id}`, data);
  }

  SearchByLabel() {
    return this.http.get(search);
  }



}
