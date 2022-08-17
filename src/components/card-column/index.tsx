import { observer } from 'mobx-react';
import * as React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Store from '../../store';
import { Cards } from '../../store/Types';
import Card from '../CardView';
import './card-column.styles.css';

interface Props {
  cards: Cards;
  status: string;
  store: Store;
}

const CardColumn: React.FC<Props> = ({ cards, status, store }) => (
  <Droppable droppableId={status}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        className="card-column"
        {...provided.droppableProps}
      >
        {cards.map((card, index) => {
          return (
            <Card card={card} key={card.id} store={store} position={index} />
          );
        })}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
);
export default observer(CardColumn);
