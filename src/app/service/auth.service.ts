import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs'; 
import { environment } from '../../environments/environment';
import { AlertService } from './alert.component';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient, 
    private router: Router,
    private m: AlertService
  ) { }

  login(body: any) {

    this.http.post<any>(`${environment.BASEURL}/login`, body).subscribe((response: any) => {

      let token = '';
      let expira: any  =  Math.floor(Date.now()+((24*60*60)*1000) /1000);
      
      localStorage.setItem("access_token", response.access_token )
      localStorage.setItem("ativo", response.ativo )
      localStorage.setItem("email", response.email )
      localStorage.setItem("interno", response.interno )
      localStorage.setItem("message", response.message )
      localStorage.setItem("nome", response.nome )
      localStorage.setItem("telefone", response.telefone )
      localStorage.setItem("user_id", response.user_id )
      localStorage.setItem("empresa_id", response.empresa_id )
      localStorage.setItem("expires", response.expires )
      localStorage.setItem("exp" , expira.toString() )
      token = response.access_token ?? '';

      this.m.alertsucess('Acesso realizado com sucesso!');

      if (token != '') {
        this.updateLoggedIn(true)
        this.router.navigate(['/dashboard']);
      }

    }, (error: any) => {
      this.m.alerterror(error.error.message);
    });

  }

  logout(): void {
    localStorage.clear();
    this.updateLoggedIn(false);
    this.router.navigate(['/login']);
  }

  updateLoggedIn($boo: boolean): void {
    this.loggedIn.next($boo);
  }

  usuarioAutenticado() {
    this.verificaVencimento();
    return this.loggedIn.value;
  }

  verificaVencimento() {

    let expires = localStorage.getItem("expires") ?? "";
    let token  = localStorage.getItem("access_token") ?? "";

    if (expires === "") {
      console.log("A variável está vazia.");
      this.loggedIn.next(false);
      return;
    }

    if(token == ""){
      this.loggedIn.next(false);
      return;
    }

    const now = new Date();
    const expirationDate = new Date(expires);

    if (now > expirationDate) {
      this.loggedIn.next(false);
      return;
    } 
    
    this.loggedIn.next(true);

  }

}
