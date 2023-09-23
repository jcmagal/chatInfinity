import { Observable } from 'rxjs';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MessageService, Message } from '../message.service';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-chat-group',
  templateUrl: './chat-group.component.html',
  styleUrls: ['./chat-group.component.css'],
})
export class ChatGroupComponent implements OnInit {
  selectedGroup: string = '';
  messages$: Observable<Message[]> = new Observable<Message[]>();
  messages: Message[] = [];
  @Output() groupSelectedEmitter = new EventEmitter<string>();
  @Output() groupSelected: EventEmitter<string> = new EventEmitter<string>();

  constructor(private messageService: MessageService, private socketService: SocketService) {}

  ngOnInit(): void {
    this.messageService.messages$.subscribe((messages) => {
      this.messages = messages;
    });
    this.loadRoomMessages();
  }

  groupList = [
    'Gerência',
    'Financeiro',
    'Vendas',
    'Compras',
    'Estoque',
    'Recursos Humanos',
    'Geral',
  ];

  selectGroup(group: string): void {
    this.selectedGroup = group;
    this.loadRoomMessages(group);
    this.groupSelectedEmitter.emit(group);
  }
  onGroupClick(groupName: string) {
    this.groupSelected.emit(groupName);
  }

  loadRoomMessages(group?: string) {
    if (group) {
      this.messages$ = this.socketService.getMessagesByGroup(group);
    }
    this.messages$.subscribe((messages: Message[]) => {
      console.log(messages);
    });
  }
}
