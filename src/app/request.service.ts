import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private REST_API_SERVER = "https://billing-backend.vercel.app/api/accessories/";

  constructor(private http: HttpClient) { }

  postData(data: any) {
    const headers = { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*'};
    const body = JSON.stringify(data);
 
    return this.http.post(this.REST_API_SERVER + 'add', body, {'headers':headers});
  }

  getData(model: any) {
    let params = new HttpParams();
    params = params.append('model', encodeURIComponent(model));
    return this.http.get(this.REST_API_SERVER + 'get', {params: params});
  }

  getModels() {
    return this.http.get(this.REST_API_SERVER + 'getmodels');
  }

  sale(data: any) {
    const headers = {'content-type': 'application/json', 'Access-Control-Allow-Origin': '*'};
    const body = JSON.stringify(data);
 
    return this.http.post(this.REST_API_SERVER + 'sale', body, {'headers':headers});
  }

  getSno() {
    return this.http.get(this.REST_API_SERVER + 'getsno');
  }
}
