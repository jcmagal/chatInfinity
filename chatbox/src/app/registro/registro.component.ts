import { Component, OnInit, Output } from '@angular/core';
import { SocketService } from '../socket.service';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent implements OnInit {
  selectedGroup: string;
  selectedCity: string;
  @Output() citySelected = new EventEmitter<string>();
  @Output() cityListUpdated = new EventEmitter<string[]>();
  @Output() userNameEvent = new EventEmitter<string>();

  groupList = [
    'Gerência',
    'Financeiro',
    'Vendas',
    'Compras',
    'Estoque',
    'Recursos Humanos',
    'Geral',
  ];
  cityList = ['Ariquemes', 'Jaru', 'Ji-Paraná', 'Impel-ZL', 'CONAPE-PVH'];
  userName = '';
  newUserName: string;
  showForm = false;



  constructor(private socketService: SocketService) {
    const cachedUserName = localStorage.getItem('userName');
    if (cachedUserName) {
      this.userName = cachedUserName;
    }
    this.newUserName = '';
    this.selectedGroup = '';
    this.selectedCity = '';
  }

  ngOnInit() {}

  setUserName(): void {
    if (this.newUserName.trim()) {
      this.userName = this.newUserName;
      localStorage.setItem('userName', this.userName);
      this.userNameEvent.emit(this.userName);
      this.showForm = false;
    }
  }

  handleUserRegistration() {
    if (this.newUserName && this.selectedGroup && this.selectedCity) {
      this.closeRegistrationForm();
    }
  }

  showRegistrationForm(): void {
    this.showForm = true;
  }

  closeRegistrationForm(): void {
    this.showForm = false;
  }
}
