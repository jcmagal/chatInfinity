import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { io } from 'socket.io-client';
import { Message } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: any;
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:3000');
    this.listenForMessages();
  }

  private listenForMessages() {
    this.socket.on('message-broadcast', (message: Message) => {
      const currentMessages = this.messagesSubject.value;
      this.messagesSubject.next([...currentMessages, message]);
    });
  }

  public sendMessage(message: Message): void {
    this.socket.emit('message', message);
  }

  public joinGroup(groupName: string, username: string): void {
    this.socket = io('http://localhost:3000', {
      query: { group: groupName }
    });
    this.socket.emit('joinGroup', { groupName, username });
  }

  public leaveGroup(groupName: string, username: string): void {
    this.socket.emit('leaveGroup', { groupName, username });
    this.socket.disconnect();
  }

  public getGroupList(): Observable<any[]> {
    return new Observable((observer) => {
      this.socket.on('groupList', (groupList: any[]) => {
        observer.next(groupList);
      });
    });
  }



  public getMessagesByGroup(groupName: string): Observable<Message[]> {
    return this.http.get<Message[]>(`http://localhost:3000/api/messages/${groupName}`)
      .pipe(
        catchError(error => {
          console.error("Error fetching messages:", error);
          return of([]);
        })
      );
  }

  public getUserList(): Observable<string[]> {
    return new Observable<string[]>((observer) => {
      this.socket.on('user-list', (userList: string[]) => {
        observer.next(userList);
      });
    });
  }
}
