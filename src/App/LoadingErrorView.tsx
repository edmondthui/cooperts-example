import { observer } from 'mobx-react';
import * as React from 'react';
import { LoadingError } from '../store/Types';

interface Props {
  state: LoadingError;
}

const LoadingErrorView: React.FC<Props> = ({ state }) => (
  <span>Loading cards failed: {state.error}</span>
);

export default observer(LoadingErrorView);
