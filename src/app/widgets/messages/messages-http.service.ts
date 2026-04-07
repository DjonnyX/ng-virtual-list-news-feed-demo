import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Id } from 'ng-virtual-list';
import { IMessagesChunkParams, MessagesService } from './messages.service';
import { IGetMessagesData } from './model/messages';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Injectable({
  providedIn: 'root'
})
export class MessagesHttpService implements MessagesService {
  constructor() { }

  getMessages(chatId: Id, chunk?: IMessagesChunkParams): Observable<IGetMessagesData> {
    throw new Error('Method not implemented.');
  }
}
