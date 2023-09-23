import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket.service';
import { HttpClient } from '@angular/common/http';
import { Message, MessageService } from '../message.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  public showList: boolean = false;
  public showGroupList: boolean = false;
  show: boolean = false;
  showRegistrationIcon = true;
  showForm = false;
  isRegistered: boolean = false;
  userName = '';
  message = '';
  messageList: Message[] = [];
  userList: string[] = [];
  selectedFile: File | null = null;
  selectedGroup: string = '';
  groupList = [
    'Gerência',
    'Financeiro',
    'Vendas',
    'Compras',
    'Estoque',
    'Recursos Humanos',
    'Geral',
  ];
  selectedCity: string = '';
  cityList = ['Ariquemes', 'Jaru', 'Ji-Paraná', 'Impel-ZL', 'CONAPE-PVH'];
  newUserName = '';


  constructor(
    private socketService: SocketService,
    private messageService: MessageService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const cachedUserName = localStorage.getItem('userName');
    if (cachedUserName) {
      this.userName = cachedUserName;
      this.isRegistered = true;
    }

    this.socketService.getUserList().subscribe((userList: string[]) => {
      this.userList = userList;
    });

    this.messageService.messages$.subscribe((messages: any[]) => {
      this.messageList = messages.map((msg) => ({
        ...msg,
        mine: msg.sender === this.userName,
      }));
    });
}

  updateUserName(): void {
    if (this.newUserName.trim()) {
      this.handleUserNameSet(this.newUserName);
    }
  }

  handleLocalUserNameUpdate(): void {
    if (this.newUserName.trim()) {
      this.handleUserNameSet(this.newUserName);
    }
  }

  userNameUpdate(name: string): void {
    this.userName = name;
    localStorage.setItem('userName', name);
    this.isRegistered = true;
}

  handleFileSelected(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.selectedFile = event.target.files[0];
    }
  }

  messageToUser(): void {
    if (this.message.trim() !== '') {
      this.socketService.sendMessage({
        text: this.message,
        sender: this.userName,
        timestamp: new Date(),
        group: this.selectedGroup
      });  // Usando sendMessage diretamente
      this.message = '';
    }

  }
  onCitySelected(newValue: string) {
    this.selectedCity = newValue;
  }

  onCityListUpdated(newList: string[]) {
    this.cityList = newList;
  }

  handleUserNameSet(newName: string): void {
    this.userNameUpdate(newName);
  }

  onGroupSelected(groupName: string) {
    this.selectedGroup = groupName;
}

  toggleGroup(): void {
    this.showGroupList = !this.showGroupList;
    this.showList = false;
  }

  onButtonClick() {
    this.show = !this.show;
  }

  toggleList(): void {
    this.showList = !this.showList;
    this.showGroupList = false;
  }

  hideRegistrationIcon(): void {
    this.showRegistrationIcon = false;
  }

  showRegistrationForm(): void {
    this.showForm = true;
  }

  closeRegistrationForm(): void {
    this.showForm = false;
  }
}
