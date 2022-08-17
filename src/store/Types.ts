<<<<<<< HEAD
import { assertNever } from '@kofno/piper';
import { just, Maybe, nothing } from 'maybeasy';
import { Card, CardStatus, DB, Position } from '../KanbanDB/types';

export type Cards = ReadonlyArray<Card>;

interface HasCardData {
  db: DB;
  cards: Cards;
}

export interface Waiting {
  kind: 'waiting';
}

export const waiting = (): Waiting => ({
  kind: 'waiting',
});

export interface Loading {
  kind: 'loading';
  db: DB;
}

export const loading = (db: DB): Loading => ({
  kind: 'loading',
  db,
});

export interface Ready extends HasCardData {
  kind: 'ready';
}

export const ready = ({ db, cards }: HasCardData): Ready => ({
  kind: 'ready',
  db,
  cards,
});

export interface InputCardName extends HasCardData {
  kind: 'input-card-name';
  name: string;
}

export const inputCardName = (
  { db, cards }: HasCardData,
  name: string
): InputCardName => ({
  kind: 'input-card-name',
  db,
  cards,
  name,
});

export interface SelectCardStatus extends HasCardData {
  kind: 'select-card-status';
  name: string;
  status: Maybe<CardStatus>;
}

export const selectCardStatus = (
  { db, cards }: HasCardData,
  name: string,
  status: Maybe<CardStatus>
): SelectCardStatus => ({
  kind: 'select-card-status',
  db,
  cards,
  name,
  status,
});

export interface AddNewCard extends HasCardData {
  kind: 'add-new-card';
  name: string;
  position: Position;
}

export const addNewCard = (
  { db, cards }: HasCardData,
  name: string,
  position: Position
): AddNewCard => ({
  kind: 'add-new-card',
  db,
  cards,
  name,
  position,
});

export interface DeleteCard extends HasCardData {
  kind: 'delete-card';
  deletedCard: Card;
  name: Maybe<string>;
}

export const deleteCard = (
  previousState: Ready | InputCardName,
  deletedCard: Card
): DeleteCard => {
  switch (previousState.kind) {
    case 'input-card-name':
      return {
        kind: 'delete-card',
        db: previousState.db,
        cards: previousState.cards,
        deletedCard,
        name: just(previousState.name),
      };
    case 'ready':
      return {
        kind: 'delete-card',
        db: previousState.db,
        cards: previousState.cards,
        deletedCard,
        name: nothing(),
      };
    default:
      assertNever(previousState);
  }
};

export interface MoveCard extends HasCardData {
  kind: 'move-card';
  movedCard: Card;
  name: Maybe<string>;
  newLocation: Position;
}

export const moveCard = (
  previousState: Ready | InputCardName,
  movedCard: Card,
  newLocation: Position
): MoveCard => {
  switch (previousState.kind) {
    case 'input-card-name':
      return {
        kind: 'move-card',
        db: previousState.db,
        cards: previousState.cards,
        name: just(previousState.name),
        movedCard,
        newLocation,
      };
    case 'ready':
      return {
        kind: 'move-card',
        db: previousState.db,
        cards: previousState.cards,
        name: nothing(),
        movedCard,
        newLocation,
      };
  }
};

export interface LoadingError {
  kind: 'loading-error';
  error: string;
}

export const loadingError = (error: string): LoadingError => ({
  kind: 'loading-error',
  error,
});

export interface UpdateFailed extends HasCardData {
  kind: 'update-failed';
  error: string;
}

export const updateFailed = (
  { db, cards }: HasCardData,
  error: string
): UpdateFailed => ({
  kind: 'update-failed',
  db,
  cards,
  error,
});

export type State =
  | Waiting
  | Loading
  | Ready
  | InputCardName
  | SelectCardStatus
  | AddNewCard
  | DeleteCard
  | MoveCard
  | UpdateFailed
  | LoadingError;
=======
import { Resource } from "../exo_modules/Resource/Types/index";

export interface Card {
  id: string;
  name: string;
  description: string;
  status: CardType;
  created: number; // UNIX timestamp
  lastUpdated: number; // UNIX timestamp
}

export type CardResource = Resource<Card>;

export type CardType = "TODO" | "DONE" | "IN_PROGRESS" | "";

export const waiting = (): Waiting => ({
  kind: "waiting",
});

export const loading = (state: Waiting | Ready | Loading): Loading => {
  const { kind, ...previous } = state;
  return {
    kind: "loading",
    ...previous,
    createString: "",
    open: false,
    status: "",
    todo: [],
    inProgress: [],
    done: [],
    db: undefined,
  };
};

export const ready = (state: Loading | Ready): Ready => {
  const { kind, ...previous } = state;
  return {
    kind: "ready",
    ...previous,
  };
};

export const error = (message: string): Error => ({
  kind: "error",
  message,
});

interface Waiting {
  kind: "waiting";
}

export interface Loading {
  kind: "loading";
  createString: string;
  todo: Array<any>;
  inProgress: Array<any>;
  done: Array<any>;
  db: any;
  open: boolean;
  status: CardType;
}

interface Ready {
  kind: "ready";
  todo: Array<any>;
  inProgress: Array<any>;
  done: Array<any>;
  db: any;
  createString: string;
  open: boolean;
  status: CardType;
}

interface Error {
  kind: "error";
  message: string;
}

export type State = Waiting | Loading | Ready | Error;
>>>>>>> main
