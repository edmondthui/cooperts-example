import { observer } from 'mobx-react';
import * as React from 'react';
import Store from '../store';
import Reactions from '../store/Reaction';
import './index.css';
import View from './View';

interface Props {}

const store = new Store();

const App: React.FC<Props> = () => (
  <>
    <View store={store} />
    <Reactions store={store} fireImmediately={true} />
  </>
);

export default observer(App);
