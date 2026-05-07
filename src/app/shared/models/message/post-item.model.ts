import { Id } from 'ng-virtual-list';
import { MessageTypes } from "@shared/enums";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IPostItemData {
  id: Id;
  dateTime: number;
  text: string;
  type?: MessageTypes,
}