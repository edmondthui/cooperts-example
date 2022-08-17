import { observer } from 'mobx-react';
import React from 'react';
import Store from '../../store';
import CardNameInput from './CardNameInput';
import './create-card.styles.css';
import StatusSelector from './StatusSelector';

interface Props {
  store: Store;
}

const CreateCard: React.FC<Props> = ({ store }) => (
  <div className="create-card">
    <StatusSelector store={store} />
    <CardNameInput store={store} />
  </div>
);

export default observer(CreateCard);
