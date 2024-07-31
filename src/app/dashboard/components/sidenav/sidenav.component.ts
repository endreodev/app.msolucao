import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent { 

  isOpen = false;
  fieldOne: string = '';
  fieldTwo: string = '';
  travaForm!: FormGroup;

  private listener!: () => void;

  constructor(private renderer: Renderer2, private el: ElementRef,private fb: FormBuilder,) {
    this.listener = this.renderer.listen('document', 'click', (event) => {
      if (!this.el.nativeElement.contains(event.target) && this.isOpen) {
        this.toggleSidenav(null);
      }
    });
    this.travaForm = this.fb.group({
      empresa_id: new FormControl(''),
      produto_id: new FormControl('OURO'),
      parceiro_id: new FormControl(''),
      usuario_id: new FormControl(''),
      quantidade: new FormControl(''),
      preco_unitario: new FormControl(''),
      preco_total: new FormControl(''),
      cotacao: new FormControl(''),
      desagio: new FormControl(''),
      ativo: new FormControl(true),
      status: new FormControl('A'),
      // Campos de integração
      codcontrole: new FormControl(''),
      sucesso: new FormControl(false),
      mensagem: new FormControl('')
    });
  }

  toggleSidenav(event: any) {
    if(event != null){
      event.stopPropagation();  // Isso impede que o evento de clique se propague
    }

    this.isOpen = !this.isOpen;
}


  ngOnDestroy(): void {
    this.listener();  // Remove listener when component is destroyed to prevent memory leaks
  }


  onSubmit() {
    console.log(this.travaForm.value);
    // Adicione aqui a lógica para enviar os dados para a API
  }
}