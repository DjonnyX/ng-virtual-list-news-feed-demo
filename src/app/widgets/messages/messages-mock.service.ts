import { Injectable } from '@angular/core';
import { delay, Observable, of, switchMap, throwError } from 'rxjs';
import { generateMessageCollection } from '@mock/const/collection';
import { Id, IVirtualListCollection } from 'ng-virtual-list';
import { IMessagesChunkParams, MessagesService } from './messages.service';
import { IGetMessagesAnswer, IGetMessagesData } from './model/messages';
import { IMessage } from './model/message';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
interface IDB {
    version: number;
    chats: {
        [chatId: string]: {
            version: number;
            messages?: IVirtualListCollection<IMessage>;
        }
    };
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const db: IDB = {
    version: 0,
    chats: {},
};

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const operations: {
    chatId: Id | null;
} = {
    chatId: null,
};

const DEFAULT_CHUNK_NUMBER = 1,
    DEFAULT_CHUNK_SIZE = 100;


/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
const sortByDateTime = (a: IMessage, b: IMessage) => {
    if (a.dateTime > b.dateTime) {
        return 1;
    }
    if (a.dateTime < b.dateTime) {
        return -1;
    }
    return 0;
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Injectable({
    providedIn: 'root'
})
export class MessagesMockService implements MessagesService {
    constructor() { }

    getMessages(chatId: Id, chunk?: IMessagesChunkParams): Observable<IGetMessagesData> {
        operations.chatId = chatId;

        if (!db.chats[chatId]) {
            db.chats[chatId] = {
                version: 0,
            };
        }
        if (!Array.isArray(db.chats[chatId].messages)) {
            db.chats[chatId].messages = [];
        }
        const number = chunk?.number ?? DEFAULT_CHUNK_NUMBER, size = chunk?.size ?? DEFAULT_CHUNK_SIZE,
            items: IVirtualListCollection<IMessage> = [];

        let listChunk: IVirtualListCollection<IMessage>;
        if (chunk) {
            listChunk = generateMessageCollection(number, size);
            if (number === 1) {
                db.chats[chatId].messages = [...listChunk];
            } else {
                db.chats[chatId].messages.push(...listChunk);
            }
            db.chats[chatId].messages = db.chats[chatId].messages.sort(sortByDateTime);
        } else {
            listChunk = [];
            const dbMessages = db.chats[chatId].messages;
            let num = 1, chunkSize = Math.min(db.chats[chatId].messages.length, size);
            while (num <= chunkSize && dbMessages.length - num > -1) {
                const i = dbMessages.length - num, message = dbMessages[i];
                if ((message as any).__deleted__) {
                    chunkSize++;
                } else {
                    listChunk.push(message);
                }
                num++;
            }
        }
        for (let i = 0, l = Math.min(db.chats[chatId].messages.length, size); i < l; i++) {
            const msg = listChunk[i];
            items.push(msg);
        }
        const result: IGetMessagesAnswer = {
            data: {
                version: db.chats[chatId].version,
                items,
            },
        };
        return of(result).pipe(
            delay(0),
            switchMap(res => {
                if (res.error) {
                    return throwError(() => {
                        return `Get message chunk error: ${res.error}`;
                    });
                }
                if (!res.data) {
                    return throwError(() => {
                        return `Error in receiving data.`;
                    });
                }
                return of(res.data);
            }),
        );
    }
}
