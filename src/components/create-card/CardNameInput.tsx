import { assertNever } from '@kofno/piper';
import { nothing } from 'maybeasy';
import { observer } from 'mobx-react';
import * as React from 'react';
import Store from '../../store';

interface Props {
  store: Store;
}

const handleNameCompletion =
  (store: Store) => (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    store.selectCardStatus(nothing());
  };

const handleNameInput =
  (store: Store) => (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    store.inputCardName(e.currentTarget.value);
  };

const CardNameInput: React.FC<Props> = ({ store }) => {
  const state = store.state;
  switch (state.kind) {
    case 'waiting':
    case 'loading':
    case 'loading-error':
      return <></>;
    case 'ready':
    case 'input-card-name':
    case 'select-card-status':
    case 'update-failed':
    case 'add-new-card':
    case 'delete-card':
    case 'move-card':
      return (
        <form
          onSubmit={handleNameCompletion(store)}
          className="create-card-form"
        >
          <input
            onChange={handleNameInput(store)}
            value={store.cardName}
            placeholder="e.g. Bug: TextPoll not dispatching half stars"
            maxLength={500}
          />
          <button>ADD NEW</button>
        </form>
      );
    default:
      assertNever(state);
  }
};

export default observer(CardNameInput);
