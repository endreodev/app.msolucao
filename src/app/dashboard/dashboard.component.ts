import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  interno:any  = false;

  constructor(){ }

  ngOnInit(): void { 
    this.interno = localStorage.getItem('interno') === 'true';
  }
}
