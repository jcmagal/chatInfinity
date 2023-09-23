import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { UserListComponent } from './user-list/user-list.component';
import { MessageListComponent } from './message-list/message-list.component';
import { ChatGroupComponent } from './chat-group/chat-group.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SocketService } from './socket.service';
import { MessageService } from './message.service';
import { RegistroComponent } from './registro/registro.component';






@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    UserListComponent,
    MessageListComponent,
    ChatGroupComponent,
      RegistroComponent
   ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,

  ],
  providers: [SocketService, MessageService],

  bootstrap: [AppComponent]
})
export class AppModule { }
