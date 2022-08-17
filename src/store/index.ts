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

class Store {
  @observable
  state: State = waiting();

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
        break;
      default:
        assertNever(this.state);
    }
  };

  @action
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
        break;
      default:
        assertNever(this.state);
    }
  };

  @action
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
        break;
      default:
        assertNever(this.state);
    }
  };

  @action
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
        break;
      default:
        assertNever(this.state);
    }
  };

  @action
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
    }
  };

  @action
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
    }
  };

  @action
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
    }
  };

  @action
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
    }
  };

  @action
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
    }
  };

  @action
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
        break;
      default:
        assertNever(this.state);
    }
  };

  @action
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
}

export default Store;
