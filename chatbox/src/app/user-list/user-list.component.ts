import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: { name: string, isConnected: boolean }[] = [];
  userList: string[] = [];

  constructor(private socketService: SocketService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.socketService.getUserList().subscribe((userList: string[]) => {
      this.userList = userList;
    });
  }
}
