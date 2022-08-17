import { Maybe } from 'maybeasy';
import { StorageError } from '../Storage';

export interface InvalidData {
  kind: 'invalid-data';
  error: string;
}

export const invalidData = (error: string): InvalidData => ({
  kind: 'invalid-data',
  error,
});

export type DBError = StorageError | InvalidData;

export type GUID = string;

export type CardStatus = 'todo' | 'in-progress' | 'done';

export interface Position {
  status: CardStatus;
  priority: number;
}

export const position = (status: CardStatus, priority: number): Position => ({
  status,
  priority,
});

export interface Card {
  id: GUID;
  name: string;
  description: Maybe<string>;
  position: Position;
  createdAt: Date;
  updatedAt: Date;
}

export type CardData = Pick<Card, 'name' | 'position'>;

export type InstanceID = string;

export interface DB {
  instanceID: InstanceID;
}

export const byStatusEquality =
  (status: CardStatus) =>
  (card: Card): boolean =>
    status === card.position.status;

export const byNotThisCard =
  (thisCard: Card) =>
  (otherCard: Card): boolean =>
    thisCard.id !== otherCard.id;
