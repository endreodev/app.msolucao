import { Component, NgZone, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Qout } from './interface/qout';
import { environment } from '../../../../environments/environment';
import { ParceiroSharedService } from '../cadastros/parceiro/service/parceiro.shared.service';
import { TravaService } from './service/trava.service'; 
import { ActivatedRoute } from '@angular/router';
import { Travas } from './interface/trava';
import { ParceiroService } from '../cadastros/parceiro/service/parceiro.service';
import { AlertService } from '../../../service/alert.component';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, OnDestroy , AfterViewInit {

  limiteParceiro: number=0;
  percentual:number=0;

  gramas?: any = 0;
  cotationPrice: number = 0;
  cotationReal: number = 0;
  subscription: Subscription = new Subscription();
  idParceiro: string = "";
  eventSource?: EventSource;
  exibirProgressBar: boolean = true;
  stringTrava: string = "";
  quantidadeTrava: number = 0; 
  
  current_page:number = 0;
  paginas:number[] = [];
  totalRegistros:number = 0;
  travas: Travas[] = [];

  interno:boolean = false;

  constructor(
    private travaService: TravaService,
    private router: ActivatedRoute,
    private m: AlertService,
    private ngZone: NgZone,
    private parceiroShare: ParceiroSharedService,
    private httpParceiro: ParceiroService
  ) {
    this.interno = localStorage.getItem('interno') === "true"
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.parceiroShare.currentParceiroID.subscribe( (id: string) => {
      this.idParceiro = id;
      if(this.idParceiro != ""){
        this.reconnectEventSource();
        this.atualizartabela();
        // this.buscarDadosParceiro();
      }

    })
  }

  buscarDadosParceiro(){
    if(this.isValid(this.idParceiro)){
      this.httpParceiro.getId(this.idParceiro).subscribe( (responde: any) => {
        this.limiteParceiro = responde.lmt_mes
        this.percentual = ( this.quantidadeTrava/this.limiteParceiro ) ;
      })
    }
  }

  atualizartabela(page: any = 1){
    if(this.interno){
      this.atualizalistaTravasTodos(page);
    }else{
      this.atualizalistaTravas(page);
    }
  }

  isValid(value: any): boolean {
    return value !== undefined && value !== null && value !== 0 && value !== '';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.closeEventSource();   
  }

  reconnectEventSource(): void {
    this.closeEventSource();

    const token: string = localStorage.getItem("access_token") ?? "";
    const url: string = `${environment.BASEURL}/sse/${this.idParceiro}?token=${encodeURIComponent(token)}`;
    this.eventSource = new EventSource(url);

    this.eventSource.onmessage = (event) => {
      this.ngZone.run(() => {
        this.exibirProgressBar = true;
        const data: Qout = JSON.parse(event.data);
        this.cotationPrice = data.negociado || 0;
        this.cotationReal  = data.valor_grama_real || 0;
      });
    };

    this.eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      this.exibirProgressBar = false;
      this.eventSource?.close();
    };
  }

  closeEventSource(): void {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }

  atualizalistaTravas(page: any = 1){

    this.travaService.getTrava(this.idParceiro, page ).subscribe( (response: any) =>{

      this.current_page   = response.current_page
      this.paginas        = Array.from({ length: response.pages }, (_, i) => i + 1);
      this.totalRegistros = response.total
      this.travas         = response.travas

    },(error: any)=>{
      this.current_page   = 0 ;
      this.paginas        = [] ;
      this.totalRegistros = 0 ;
      this.travas = [];
    });

    this.travaService.getTravaMes(this.idParceiro).subscribe( (resp: any) =>{
      this.stringTrava = " - "+resp.mes+"/"+resp.ano;
      this.quantidadeTrava = resp.quantidade_vendas;

      this.buscarDadosParceiro()
    }, (error: any)=>{
      this.stringTrava      = "";
      this.quantidadeTrava  = 0;
    });

    
  }


  atualizalistaTravasTodos(page: any = 1){

    this.travaService.getTravaTodos(this.idParceiro, page ).subscribe( (response: any) =>{

      this.current_page   = response.current_page
      this.paginas        = Array.from({ length: response.pages }, (_, i) => i + 1);
      this.totalRegistros = response.total
      this.travas         = response.travas

      this.buscarDadosParceiro()
    },(error: any)=>{
      this.current_page   = 0 ;
      this.paginas        = [] ;
      this.totalRegistros = 0 ;
      this.travas = [];
    });

    this.travaService.getTravaMes(this.idParceiro).subscribe( (resp: any) =>{
      this.stringTrava = " - "+resp.mes+"/"+resp.ano;
      this.quantidadeTrava = resp.quantidade_vendas;


    }, (error: any)=>{
      this.stringTrava      = "";
      this.quantidadeTrava  = 0;
    });

    
  }

  get valorTotal(): number {
    return this.cotationPrice * this.gramas;
  }


  // paginação
  previousPage(): void {
    if (this.current_page > 1) {
      this.goToPage(this.current_page - 1);
    }
  }

  nextPage(): void {
    if (this.current_page < this.totalRegistros) {
      this.goToPage(this.current_page + 1);
    }
  }

  goToPage(page: number): void {
    this.atualizartabela(page);
  }

  // REALISA ORDEM DE VENDA 
  realizarOrdemTrava(){

    const requestBody = {
      empresa_id: 1,
      parceiro_id: this.idParceiro, 
      quantidade: this.gramas, 
      preco_unitario: this.cotationPrice,  
      preco_total: this.valorTotal,
      cotacao: this.cotationReal
    };

    this.travaService.postTrava(requestBody).subscribe( (response: any)=>{
      // Swal.fire({position: "top-end", icon: 'success',title: 'Ordem de venda!',text: response.message,showConfirmButton: false,timer: 1500});
      this.m.alertsucess(response.message);
      this.gramas = 0;
      this.atualizartabela(1);
    }, (error: any)=>{
      // Swal.fire({position: "top-end", icon: 'error', title: 'Ordem de venda!', text: error.error.message, showConfirmButton: false,  timer: 1500});
      this.m.alerterror(error.error.message);
    });  
    
  }


  encerraOrderm(id: number){
    this.travaService.getTravaEncerrar(id).subscribe( (response: any)=>{
      // Swal.fire({position: "top-end", icon: 'success',title: 'Ordem de venda!',text: response.message,showConfirmButton: false,timer: 1500});
      this.m.alertsucess(response.message);
      this.gramas = 0;
      this.atualizartabela(1);
    }, (error: any)=>{
      this.m.alerterror(error.error.message);
      // Swal.fire({position: "top-end", icon: 'error', title: 'Ordem de venda!', text: error.error.message, showConfirmButton: false,  timer: 1500});
    });
  }


  cancelarOrderm(id: number){

    Swal.fire({
      title: 'Você tem certeza do cancelamento ?',
      text: 'Esta ação não poderá ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, finalizar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // this.encerraOrderm(id);
        alert("ordem excluida")
      }
    });
    // this.travaService.getTravaEncerrar(id).subscribe( (response: any)=>{
    //   // Swal.fire({position: "top-end", icon: 'success',title: 'Ordem de venda!',text: response.message,showConfirmButton: false,timer: 1500});
    //   this.m.alertsucess(response.message);
    //   this.gramas = 0;
    //   this.atualizartabela(1);
    // }, (error: any)=>{
    //   this.m.alerterror(error.error.message);
    //   // Swal.fire({position: "top-end", icon: 'error', title: 'Ordem de venda!', text: error.error.message, showConfirmButton: false,  timer: 1500});
    // });
  }



  clearField() {
    this.gramas = null; // ou "" se você estiver usando string
  }

}
