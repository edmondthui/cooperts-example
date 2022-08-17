import { observer } from 'mobx-react';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Card } from '../../KanbanDB/types';
import Store from '../../store';
import './card.styles.css';

interface Props {
  card: Card;
  store: Store;
  position: number;
}

const getCardStyle = (isDragging: any, draggableStyle: any) => {
  if (isDragging && draggableStyle.transform !== null)
    draggableStyle.transform += ' rotate(3deg)';
  return { ...draggableStyle };
};

const handleDelete =
  (store: Store, card: Card) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    store.delete(card);
  };

const CardView: React.FC<Props> = ({ card, store, position }) => (
  <Draggable draggableId={card.id} index={position}>
    {(provided, snapshot) => (
      <div
        className="card"
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        id={card.id}
        style={getCardStyle(snapshot.isDragging, provided.draggableProps.style)}
      >
        {card.name}
        <button onClick={handleDelete(store, card)} className="delete">
          &#10005;
        </button>
      </div>
    )}
  </Draggable>
);

export default observer(CardView);