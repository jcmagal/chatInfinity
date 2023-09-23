import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SocketService } from './socket.service';

export interface Message {
  text?: string;
  sender: string;
  timestamp: Date;
  group: string;
  file?: {
    filename: string;
    filetype: string;
    data: any;
  };
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  public messages$ = this.messagesSubject.asObservable();
  message = '';
  userName = '';
  messageList: Message[] = [];
  public selectedGroup!: string;

  constructor(private socketService: SocketService) {
    this.socketService.messages$.subscribe((messages: Message[]) => {
      const currentMessages = this.messagesSubject.value;
      this.messagesSubject.next([...currentMessages, ...messages]);
    });
  }

  sendMessage(content: string, file?: File): void {
    const newMessage: Message = {
      text: content,
      sender: this.userName,
      timestamp: new Date(),
      group: this.selectedGroup,
      file: file
        ? {
            filename: file.name,
            filetype: file.type,
            data: file,
          }
        : undefined,
    };
    this.messageList.push(newMessage);
    this.message = '';
    this.socketService.sendMessage(newMessage);
  }

  public addMessage(message: Message): void {
    this.messageList.push(message);
  }
}
