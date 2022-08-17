import { assertNever } from '@kofno/piper';
import { observer } from 'mobx-react';
import * as React from 'react';
import CardColumns from '../components/card-columns';
import Store from '../store';
import Loading from './Loading';
import LoadingErrorView from './LoadingErrorView';

interface Props {
  store: Store;
}

const View: React.FC<Props> = ({ store }) => {
  const state = store.state;
  switch (state.kind) {
    case 'waiting':
    case 'loading':
      return <Loading />;
    case 'loading-error':
      return <LoadingErrorView state={state} />;
    case 'ready':
    case 'input-card-name':
    case 'select-card-status':
    case 'add-new-card':
    case 'update-failed':
    case 'delete-card':
    case 'move-card':
      return <CardColumns store={store} />;
    default:
      assertNever(state);
  }
};

export default observer(View);
