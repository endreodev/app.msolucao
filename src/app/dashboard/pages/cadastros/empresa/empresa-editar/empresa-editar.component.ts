import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { EmpresaService } from '../service/empresa.service';
import { Empresa } from '../interface/empresa';
import { async } from 'rxjs';
import { AlertService } from '../../../../../service/alert.component';

@Component({
  selector: 'app-empresa-editar',
  templateUrl: './empresa-editar.component.html',
  styleUrl: './empresa-editar.component.css'
})
export class EmpresaEditarComponent {

  empresaForm!: FormGroup;

  id: string = "";

  constructor(
    private fb: FormBuilder,
    private router: ActivatedRoute,
    private route: Router,
    private httpEmpresa: EmpresaService,
    private m: AlertService
  ) {
    this.empresaForm = this.fb.group({
      cgc: new FormControl('', [Validators.required, Validators.minLength(14), Validators.maxLength(18)]),
      empresa: new FormControl('', [Validators.required, Validators.minLength(3)]),
      nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
      telegran: new FormControl(''),
      valsaldo: new FormControl(true),
      ativo: new FormControl(true)
    });
  }

  ngOnInit() {
    this.router.paramMap.subscribe(async (params:any) => {
      this.id = params.get('id') ?? "";
      this.garregaInformacoes();
    });
  }

  garregaInformacoes() {
    this.httpEmpresa.getId(this.id).subscribe((response: Empresa) => {
      this.empresaForm.patchValue({
        cgc: response.cgc,
        empresa: response.empresa,
        nome: response.nome,
        telegran: response.telegran,
        valsaldo: response.valsaldo,
        ativo: response.ativo
      });
    }, (error: any) => this.route.navigate(['dashboard/empresa']));
  }


  onSubmit() {
    console.log(this.empresaForm.value);
    if (this.empresaForm.valid) {

      const formValue = { ...this.empresaForm.value };

      formValue.valsaldo = formValue.valsaldo  === 'true' || formValue.valsaldo == true;
      formValue.ativo    = formValue.ativo     === 'true' || formValue.ativo == true;
      
      this.httpEmpresa.update(this.id, formValue).subscribe((response: any) => {
        this.m.alertsucess(response.message);
        this.route.navigate(['dashboard/empresa']);
      }, (error: any) => {
        this.m.alerterror(error.statusText)
      });
    }
  }

}
