import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrl: './perfil-usuario.component.css'
})
export class PerfilUsuarioComponent {

    nomeUsuario = localStorage.getItem('nome');

    constructor(
      private auth: AuthService
    ){}

    sair(){
      this.auth.logout();
    }
}
