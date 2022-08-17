/* eslint-disable */
import { drop, first } from '@execonline-inc/collections';
import { assertNever } from '@kofno/piper';
import { observer } from 'mobx-react';
import React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { err, fromNullable, ok, Result } from 'resulty';
import { cardStatusDecoder } from '../../KanbanDB/decoders';
import { position } from '../../KanbanDB/types';
import Store from '../../store';
import CardColumn from '../card-column';
import CreateCard from '../create-card';
import './card-columns.styles.css';

interface Props {
  store: Store;
}

function at<T>(index: number, things: ReadonlyArray<T>): Result<string, T> {
  return first(drop(index, things)).cata<Result<string, T>>({
    Just: ok,
    Nothing: () => err('No card at drag source'),
  });
}

const onDragEnd = (store: Store) => (result: DropResult) => {
  const { destination, source } = result;
  ok({})
    .assign('destination', fromNullable('No destination', destination))
    .assign('sourceStatus', cardStatusDecoder.decodeAny(source.droppableId))
    .assign('destinationStatus', ({ destination }) =>
      cardStatusDecoder.decodeAny(destination.droppableId)
    )
    .assign('destinationPriority', ({ destination }) => ok(destination.index))
    .assign('movedCard', ({ sourceStatus }) => {
      switch (sourceStatus) {
        case 'done':
          return at(source.index, store.done);
        case 'in-progress':
          return at(source.index, store.inProgress);
        case 'todo':
          return at(source.index, store.todos);
        default:
          assertNever(sourceStatus);
      }
    })
    .elseDo((err) => console.warn(err))
    .do(({ destinationStatus, movedCard, destinationPriority }) => {
      store.moveCard(
        movedCard,
        position(destinationStatus, destinationPriority)
      );
    });
};

const CardColumns: React.FC<Props> = ({ store }) => {
  return (
    <div className="App">
      <div className="columns-container">
        <DragDropContext onDragEnd={onDragEnd(store)}>
          <div className="column-container">
            <h1 className="column-title">To-do</h1>
            <CardColumn cards={store.todos} status="todo" store={store} />
          </div>
          <div className="column-container">
            <h1 className="column-title">In Progress</h1>
            <CardColumn
              cards={store.inProgress}
              status="in-progress"
              store={store}
            />
          </div>
          <div className="column-container">
            <h1 className="column-title">Done</h1>
            <CardColumn cards={store.done} status="done" store={store} />
          </div>
          <CreateCard store={store} />
        </DragDropContext>
      </div>
    </div>
  );
};
export default observer(CardColumns);
