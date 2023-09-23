import { Component, OnInit, Input } from '@angular/core';
import { MessageService, Message } from '../message.service';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  @Input() selectedGroup: string | undefined;
  @Input() messages: Message[] = [];
  currentUserName: string = '';

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.messageService.messages$
  .subscribe((messages: Message[]) => {
    if (this.selectedGroup) {
      this.messages = messages.filter(message => message.group === this.selectedGroup);
    } else {
        this.messages = messages;
      }
    });
  }
  getMessagesToShow(): Message[] {
    return this.messages;
  }
}
