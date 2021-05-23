import { User } from '../../user/contracts/state';
import { LoadingStatus } from '../../../types';

export enum AddFormState {
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  NEVER = 'NEVER',
}

export interface Tweet {
  _id: string;
  text: string;
  images?: string[];
  createdAt: string;
  user: User;
}

export interface TweetsState {
  items: Tweet[];
  LoadingStatus: LoadingStatus;
  addFormState: AddFormState;
}
