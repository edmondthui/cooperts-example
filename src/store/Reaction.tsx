/* eslint-disable */
import { assertNever } from '@kofno/piper';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { addCard, deleteCard, getCards, moveCard, openDB } from '../KanbanDB';
import Store from './index';
import ReactionComponent, { RCProps } from './ReactionComponent';
import { State } from './Types';

interface Props extends RCProps<Store> {
  store: Store;
}

class Reactions extends ReactionComponent<Store, State, Props> {
  tester = () => this.props.store.state;
  effect = (state: State) => {
    console.log(state.kind, toJS(state));
    const { store } = this.props;
    switch (state.kind) {
      case 'waiting':
        openDB('testDB').fork(store.loadFailed, store.load);
        break;
      case 'loading':
        getCards(state.db).fork(store.loadFailed, store.cardsLoaded);
        break;
      case 'add-new-card':
        addCard(state, state.db).fork(store.addFailed, store.successfulAdd);
        break;
      case 'delete-card':
        deleteCard(state.deletedCard, state.db).fork(
          store.deleteFailed,
          store.successfulDelete
        );
        break;
      case 'move-card':
        moveCard(state.movedCard, state.newLocation, state.db).fork(
          store.failedMove,
          store.successfulMove
        );
      case 'ready':
      case 'loading-error':
      case 'input-card-name':
      case 'select-card-status':
      case 'update-failed':
        break;
      default:
        assertNever(state);
    }
  };
}

export default observer(Reactions);
