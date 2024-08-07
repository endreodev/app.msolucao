import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'; 
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Trava } from '../interface/trava';

@Injectable({
  providedIn: 'root'
})
export class TravaService {

  constructor(private http: HttpClient) { }

  getTrava(parceiro_id: string , page: any): Observable<any[]> {
    return this.http.get<any[]>(environment.BASEURL+"/trava/parceiro/"+parceiro_id+"?page="+page+"&per_page=5");
  }

  getTravaTodos(parceiro_id: string , page: any): Observable<any[]> {
    return this.http.get<any[]>(environment.BASEURL+"/trava?page="+page+"&per_page=5");
  }

  getTravaMes(parceiro_id: string): Observable<any>{
    return this.http.get(environment.BASEURL+"/trava/mes-parceiro/"+parceiro_id);
  }

  postTrava(body: any): Observable<any[]> {
    return this.http.post<any[]>( environment.BASEURL+"/trava" , body );
  }

  getTravaEncerrar(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.BASEURL}/trava/encerrar/${id}`);
  }


  getTravaCancelar(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.BASEURL}/trava/cancelar/${id}`);
  }

  getTravaIntegracao(parceiro_id: string): Observable<any>{
    return this.http.get(environment.BASEURL+"/trava/trava-integracao/"+parceiro_id);
  }

}
