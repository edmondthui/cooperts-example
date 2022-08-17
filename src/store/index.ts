<<<<<<< HEAD
/* eslint-disable */
import { filter, sort, SortComparator } from '@execonline-inc/collections';
import { assertNever, pipe } from '@kofno/piper';
import { fromEmpty, Maybe } from 'maybeasy';
import { action, computed, observable } from 'mobx';
import {
  byNotThisCard,
  byStatusEquality,
  Card,
  CardStatus,
  DB,
  DBError,
  Position,
  position,
} from '../KanbanDB/types';
import {
  addNewCard,
  Cards,
  deleteCard,
  inputCardName,
  loading,
  loadingError,
  moveCard,
  ready,
  selectCardStatus,
  State,
  updateFailed,
  waiting,
} from './Types';

const byPriority: SortComparator<Card> = (a: Card, b: Card) =>
  a.position.priority - b.position.priority;

const filterAndSortCards = (status: CardStatus) =>
  pipe(filter(byStatusEquality(status)), sort(byPriority));

function cardsByStatus(status: CardStatus): (state: State) => Cards;
function cardsByStatus(status: CardStatus, state: State): Cards;
function cardsByStatus(status: CardStatus, state?: State) {
  const filtered = filterAndSortCards(status);
  const doit = (state: State): Cards => {
    switch (state.kind) {
      case 'waiting':
      case 'loading':
      case 'loading-error':
        return [];
      case 'ready':
      case 'add-new-card':
      case 'input-card-name':
      case 'select-card-status':
      case 'update-failed':
      case 'delete-card':
      case 'move-card':
        return filtered(state.cards);
      default:
        assertNever(state);
    }
  };

  return typeof state === 'undefined' ? doit : doit(state);
}

const todos = cardsByStatus('todo');
const inProgress = cardsByStatus('in-progress');
const done = cardsByStatus('done');
=======
import { action, computed, observable } from "mobx";
import { just, Maybe, nothing } from "maybeasy";
import { Card, CardType, error, loading, ready, State, waiting } from "./Types";

export const assertNever = (x: never) => {
  throw new Error(`Unexpected object: ${x}`);
};
>>>>>>> main

class Store {
  @observable
  state: State = waiting();

<<<<<<< HEAD
  @computed
  get todos(): Cards {
    return todos(this.state);
  }

  @computed
  get inProgress(): Cards {
    return inProgress(this.state);
  }

  @computed
  get done(): Cards {
    return done(this.state);
  }

  @computed
  get cardName(): string {
    switch (this.state.kind) {
      case 'loading':
      case 'loading-error':
      case 'ready':
      case 'waiting':
      case 'update-failed':
        return '';
      case 'add-new-card':
      case 'input-card-name':
      case 'select-card-status':
        return this.state.name;
      case 'delete-card':
      case 'move-card':
        return this.state.name.getOrElseValue('');
      default:
        assertNever(this.state);
    }
  }

  @action
  load = (db: DB) => {
    switch (this.state.kind) {
      case 'waiting':
        this.state = loading(db);
        break;
      case 'ready':
      case 'loading':
      case 'loading-error':
      case 'input-card-name':
      case 'select-card-status':
      case 'add-new-card':
      case 'update-failed':
      case 'delete-card':
      case 'move-card':
=======
  @action
  load = () => {
    switch (this.state.kind) {
      case "waiting":
        this.state = loading(this.state);
        break;
      case "ready":
      case "loading":
      case "error":
>>>>>>> main
        break;
      default:
        assertNever(this.state);
    }
  };

  @action
<<<<<<< HEAD
  cardsLoaded = (cards: Cards) => {
    switch (this.state.kind) {
      case 'ready':
      case 'loading-error':
      case 'waiting':
      case 'input-card-name':
      case 'select-card-status':
      case 'add-new-card':
      case 'update-failed':
      case 'delete-card':
      case 'move-card':
        break;
      case 'loading':
        const db = this.state.db;
        this.state = ready({ db, cards });
=======
  ready = (data: any) => {
    switch (this.state.kind) {
      case "ready":
      case "error":
      case "waiting":
        break;
      case "loading":
        this.state.db = data.db;
        this.state = ready(this.state);
>>>>>>> main
        break;
      default:
        assertNever(this.state);
    }
  };

  @action
<<<<<<< HEAD
  inputCardName = (name: string) => {
    const state = this.state;
    switch (state.kind) {
      case 'ready':
      case 'input-card-name':
      case 'update-failed':
        fromEmpty(name)
          .do((name) => {
            this.state = inputCardName(state, name);
          })
          .elseDo(() => {
            this.state = ready(state);
          });
        break;
      case 'loading':
      case 'loading-error':
      case 'waiting':
      case 'select-card-status':
      case 'add-new-card':
      case 'delete-card':
      case 'move-card':
        break;
      default:
        assertNever(state);
    }
  };

  @action
  selectCardStatus = (status: Maybe<CardStatus>) => {
    switch (this.state.kind) {
      case 'input-card-name':
      case 'select-card-status':
        this.state = selectCardStatus(this.state, this.state.name, status);
        break;
      case 'loading':
      case 'loading-error':
      case 'ready':
      case 'waiting':
      case 'add-new-card':
      case 'update-failed':
      case 'delete-card':
      case 'move-card':
=======
  error = (err: any) => {
    this.state = error(
      `Request failed due to '${err.kind}'. Please try again later.`
    );
  };

  @action
  setCreateString = (string: string) => {
    switch (this.state.kind) {
      case "ready":
        this.state.createString = string;
        break;
      case "error":
      case "waiting":
      case "loading":
>>>>>>> main
        break;
      default:
        assertNever(this.state);
    }
  };

  @action
<<<<<<< HEAD
  cancelStatusSelect = () => {
    switch (this.state.kind) {
      case 'select-card-status':
        this.state = inputCardName(this.state, this.state.name);
        break;
      case 'add-new-card':
      case 'input-card-name':
      case 'loading':
      case 'loading-error':
      case 'ready':
      case 'update-failed':
      case 'waiting':
      case 'delete-card':
      case 'move-card':
=======
  toggleModal = (isOpen: boolean) => {
    switch (this.state.kind) {
      case "ready":
        this.state.open = isOpen;
        break;
      case "error":
      case "waiting":
      case "loading":
>>>>>>> main
        break;
      default:
        assertNever(this.state);
    }
  };

  @action
<<<<<<< HEAD
  addNewCard = () => {
    const state = this.state;
    switch (state.kind) {
      case 'add-new-card':
      case 'input-card-name':
      case 'loading':
      case 'loading-error':
      case 'ready':
      case 'waiting':
      case 'update-failed':
      case 'delete-card':
      case 'move-card':
        break;
      case 'select-card-status':
        state.status.do((status) => {
          const newPosition = position(
            status,
            this.lowestAvailablePriority(status)
          );
          this.state = addNewCard(state, state.name, newPosition);
        });
        break;
      default:
        assertNever(state);
=======
  setStatus = (status: CardType) => {
    switch (this.state.kind) {
      case "ready":
        this.state.status = status;
        break;
      case "error":
      case "waiting":
      case "loading":
        break;
      default:
        assertNever(this.state);
>>>>>>> main
    }
  };

  @action
<<<<<<< HEAD
  delete = (card: Card) => {
    const state = this.state;
    switch (state.kind) {
      case 'add-new-card':
      case 'loading':
      case 'loading-error':
      case 'waiting':
      case 'update-failed':
      case 'select-card-status':
      case 'delete-card':
      case 'move-card':
        break;
      case 'ready':
      case 'input-card-name':
        this.state = deleteCard(state, card);
        break;
      default:
        assertNever(state);
=======
  addCard = (card: Card) => {
    switch (this.state.kind) {
      case "ready":
        switch (card.status) {
          case "TODO":
            this.state.todo = [...this.state.todo, card].flat();
            break;
          case "IN_PROGRESS":
            this.state.inProgress = [...this.state.inProgress, card].flat();
            break;
          case "DONE":
            this.state.done = [...this.state.done, card].flat();
            break;
        }
        this.state.open = false;
        this.state.createString = "";
        this.state.status = "";
        break;
      case "error":
      case "waiting":
      case "loading":
        break;
      default:
        assertNever(this.state);
>>>>>>> main
    }
  };

  @action
<<<<<<< HEAD
  successfulAdd = (card: Card) => {
    const state = this.state;
    switch (state.kind) {
      case 'input-card-name':
      case 'loading':
      case 'loading-error':
      case 'ready':
      case 'select-card-status':
      case 'waiting':
      case 'update-failed':
      case 'delete-card':
      case 'move-card':
        break;
      case 'add-new-card':
        const { cards, db } = state;
        this.state = ready({ db, cards: [...cards, card] });
        break;
      default:
        assertNever(state);
=======
  setTodo = (cards: Array<Card>) => {
    switch (this.state.kind) {
      case "ready":
        this.state.todo = cards;
        break;
      case "error":
      case "waiting":
      case "loading":
        break;
      default:
        assertNever(this.state);
>>>>>>> main
    }
  };

  @action
<<<<<<< HEAD
  successfulDelete = (deletedCard: Card) => {
    const { state } = this;
    switch (state.kind) {
      case 'input-card-name':
      case 'loading':
      case 'loading-error':
      case 'ready':
      case 'select-card-status':
      case 'waiting':
      case 'update-failed':
      case 'add-new-card':
      case 'move-card':
        break;
      case 'delete-card':
        const { cards, db, deletedCard, name } = state;
        name
          .do((name) => {
            this.state = inputCardName(
              { db, cards: cards.filter(byNotThisCard(deletedCard)) },
              name
            );
          })
          .elseDo(() => {
            this.state = ready({
              db,
              cards: cards.filter(byNotThisCard(deletedCard)),
            });
          });
        break;
      default:
        assertNever(state);
=======
  setInProgress = (cards: Array<Card>) => {
    switch (this.state.kind) {
      case "ready":
        this.state.inProgress = cards;
        break;
      case "error":
      case "waiting":
      case "loading":
        break;
      default:
        assertNever(this.state);
>>>>>>> main
    }
  };

  @action
<<<<<<< HEAD
  addFailed = ({ error }: DBError) => {
    const state = this.state;
    switch (state.kind) {
      case 'input-card-name':
      case 'loading':
      case 'loading-error':
      case 'ready':
      case 'select-card-status':
      case 'waiting':
      case 'update-failed':
      case 'delete-card':
      case 'move-card':
        break;
      case 'add-new-card':
        this.state = updateFailed(state, error);
        break;
      default:
        assertNever(state);
=======
  setDone = (cards: Array<Card>) => {
    switch (this.state.kind) {
      case "ready":
        this.state.done = cards;
        break;
      case "error":
      case "waiting":
      case "loading":
        break;
      default:
        assertNever(this.state);
>>>>>>> main
    }
  };

  @action
<<<<<<< HEAD
  loadFailed = ({ error }: DBError) => {
    switch (this.state.kind) {
      case 'waiting':
      case 'ready':
      case 'loading-error':
      case 'input-card-name':
      case 'select-card-status':
      case 'add-new-card':
      case 'update-failed':
      case 'delete-card':
      case 'move-card':
        break;
      case 'loading':
        this.state = loadingError(error);
=======
  setCards = (cards: Array<Card>) => {
    switch (this.state.kind) {
      case "ready":
        this.state.todo = cards.filter((card: Card) => card.status === "TODO");
        this.state.inProgress = cards.filter(
          (card: Card) => card.status === "IN_PROGRESS"
        );
        this.state.done = cards.filter((card: Card) => card.status === "DONE");
        this.state.open = false;
        this.state.createString = "";
        break;
      case "error":
      case "waiting":
      case "loading":
>>>>>>> main
        break;
      default:
        assertNever(this.state);
    }
  };

  @action
<<<<<<< HEAD
  moveCard = (card: Card, newLocation: Position) => {
    const { state } = this;
    switch (state.kind) {
      case 'ready':
      case 'input-card-name':
        this.state = moveCard(state, card, newLocation);
        break;
      case 'add-new-card':
      case 'delete-card':
      case 'loading':
      case 'loading-error':
      case 'move-card':
      case 'select-card-status':
      case 'update-failed':
      case 'waiting':
        break;
      default:
        assertNever(state);
    }
  };

  @action
  successfulMove = (movedCard: Card) => {
    const { state } = this;
    switch (state.kind) {
      case 'move-card':
        const { name, db, cards } = state;
        name
          .do((name) => {
            this.state = inputCardName(
              {
                db,
                cards: [...cards.filter(byNotThisCard(movedCard)), movedCard],
              },
              name
            );
          })
          .elseDo(() => {
            this.state = ready({
              db,
              cards: [...cards.filter(byNotThisCard(movedCard)), movedCard],
            });
          });
        break;
      case 'add-new-card':
      case 'delete-card':
      case 'input-card-name':
      case 'loading':
      case 'loading-error':
      case 'ready':
      case 'select-card-status':
      case 'update-failed':
      case 'waiting':
        break;
      default:
        assertNever(state);
    }
  };

  @action
  failedMove = ({ error }: DBError) => {
    const { state } = this;
    switch (state.kind) {
      case 'move-card':
        this.state = updateFailed(state, error);
        break;
      case 'add-new-card':
      case 'delete-card':
      case 'input-card-name':
      case 'loading':
      case 'loading-error':
      case 'ready':
      case 'select-card-status':
      case 'update-failed':
      case 'waiting':
        break;
      default:
        assertNever(state);
    }
  };

  @action
  deleteFailed = ({ error }: DBError) => {
    const { state } = this;
    switch (state.kind) {
      case 'waiting':
      case 'ready':
      case 'loading-error':
      case 'input-card-name':
      case 'select-card-status':
      case 'add-new-card':
      case 'update-failed':
      case 'loading':
      case 'move-card':
        break;
      case 'delete-card':
        this.state = updateFailed(state, error);
        break;
      default:
        assertNever(state);
    }
  };

  private lowestAvailablePriority = (status: CardStatus): number => {
    switch (status) {
      case 'done':
        return this.done.length;
      case 'in-progress':
        return this.inProgress.length;
      case 'todo':
        return this.todos.length;
    }
  };
=======
  delete = (cardId: string) => {
    switch (this.state.kind) {
      case "ready":
        this.state.todo = this.state.todo.filter(
          (card: Card) => card.id !== cardId
        );
        this.state.inProgress = this.state.inProgress.filter(
          (card: Card) => card.id !== cardId
        );
        this.state.done = this.state.done.filter(
          (card: Card) => card.id !== cardId
        );
        break;
      case "error":
      case "waiting":
      case "loading":
        break;
      default:
        assertNever(this.state);
    }
  };

  @computed
  get createString(): Maybe<string> {
    switch (this.state.kind) {
      case "ready":
      case "loading":
        return just(this.state.createString);
      case "waiting":
      case "error":
      default:
        return nothing();
    }
  }

  @computed
  get status(): CardType {
    switch (this.state.kind) {
      case "ready":
      case "loading":
        return this.state.status;
      case "waiting":
      case "error":
      default:
        return "";
    }
  }

  @computed
  get modalOpen(): boolean {
    switch (this.state.kind) {
      case "ready":
      case "loading":
        return this.state.open;
      case "waiting":
      case "error":
      default:
        return false;
    }
  }

  @computed
  get errorMessage(): Maybe<string> {
    switch (this.state.kind) {
      case "error":
        return just(this.state.message);
      case "ready":
      case "loading":
      case "waiting":
      default:
        return nothing();
    }
  }

  @computed
  get todo(): Array<Card> {
    switch (this.state.kind) {
      case "ready":
        return this.state.todo;
      case "error":
      case "loading":
      case "waiting":
      default:
        return [];
    }
  }

  @computed
  get inProgress(): Array<Card> {
    switch (this.state.kind) {
      case "ready":
        return this.state.inProgress;
      case "error":
      case "loading":
      case "waiting":
      default:
        return [];
    }
  }

  @computed
  get done(): Array<Card> {
    switch (this.state.kind) {
      case "ready":
        return this.state.done;
      case "error":
      case "loading":
      case "waiting":
      default:
        return [];
    }
  }

  @computed
  get db(): any {
    switch (this.state.kind) {
      case "ready":
        return this.state.db;
      case "loading":
      case "waiting":
      case "error":
      default:
        return false;
    }
  }
>>>>>>> main
}

export default Store;
