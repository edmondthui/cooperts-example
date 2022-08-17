/* eslint-disable */
import { always, assertNever, pipe } from '@kofno/piper';
import { just, Maybe, nothing } from 'maybeasy';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import Modal from 'react-modal';
import { cardStatusDecoder } from '../../KanbanDB/decoders';
import Store from '../../store';

interface Props {
  store: Store;
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    height: '25%',
    boxShadow: '0px 2px 5px 5px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'center',
  },
};

Modal.setAppElement('#root');

class StatusSelector extends React.Component<Props> {
  @computed
  get status(): Maybe<string> {
    const { state } = this.props.store;
    switch (state.kind) {
      case 'select-card-status':
        return state.status;
      case 'add-new-card':
      case 'input-card-name':
      case 'loading':
      case 'loading-error':
      case 'ready':
      case 'update-failed':
      case 'waiting':
      case 'delete-card':
      case 'move-card':
        return nothing();
      default:
        assertNever(state);
    }
  }

  @computed
  get submitDisabled(): boolean {
    return this.status.map(always(false)).getOrElseValue(true);
  }

  @computed
  get isOpen(): boolean {
    return this.props.store.state.kind === 'select-card-status';
  }

  statusHandler =
    (store: Store) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      e.preventDefault();
      const status = e.currentTarget.value;
      cardStatusDecoder.decodeAny(status).cata({
        Ok: pipe(just, store.selectCardStatus),
        Err: () => store.selectCardStatus(nothing()),
      });
    };

  submitHandler = (store: Store) => (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    store.addNewCard();
  };

  render() {
    const { store } = this.props;
    return (
      <Modal
        isOpen={this.isOpen}
        onRequestClose={store.cancelStatusSelect}
        style={customStyles}
        contentLabel="Create Card Modal"
      >
        <form onSubmit={this.submitHandler(store)} className="modal-form">
          <select
            onChange={this.statusHandler(store)}
            value={this.status.getOrElseValue('')}
          >
            <option value="" disabled={true}>
              SELECT STATUS
            </option>
            <option value="todo">To-do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <button disabled={this.submitDisabled}>CREATE CARD</button>
        </form>
      </Modal>
    );
  }
}

export default observer(StatusSelector);
