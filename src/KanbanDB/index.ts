import { mapMaybe } from '@execonline-inc/collections';
import { always, identity } from '@kofno/piper';
import { fromNullable, just, nothing } from 'maybeasy';
import { Result } from 'resulty';
import Task from 'taskarian';
import { v4 } from 'uuid';
import { allItems, clear, getItem, removeItem, setItem } from '../Storage';
import { cardDecoder } from './decoders';
import {
  Card,
  CardData,
  DB,
  DBError,
  GUID,
  InstanceID,
  invalidData,
  Position,
} from './types';

const createGUID = () => v4();

const fromResult = <E, T>(result: Result<E, T>): Task<E, T> =>
  result.cata<Task<E, T>>({ Ok: Task.succeed, Err: Task.fail });

const decodeCard = (data: string): Task<DBError, Card> =>
  fromResult(cardDecoder.decodeJson(data).mapError(invalidData));

const encodeCard = (card: Card): string =>
  JSON.stringify({
    ...card,
    description: card.description
      .map<string | null>(identity)
      .getOrElseValue(null),
    createdAt: card.createdAt.toISOString(),
    updatedAt: card.updatedAt.toISOString(),
  });

const namespace = ({ instanceID }: DB): string => `KanbanDB--${instanceID}--`;

const byNamespace =
  (db: DB) =>
  (s: string): boolean =>
    s.startsWith(namespace(db));

const getKey = (id: GUID, db: DB): string => `${namespace(db)}${id}`;

const createCard = (name: string, position: Position): Card => {
  const now = new Date(Date.now());
  return {
    id: createGUID(),
    name,
    position,
    description: nothing(),
    createdAt: now,
    updatedAt: now,
  };
};

const mergeCards =
  ({ name, position, description }: Card) =>
  (oldData: Card): Card => ({
    ...oldData,
    name,
    position,
    description,
    updatedAt: new Date(Date.now()),
  });

function storeCard(db: DB): (card: Card) => Task<DBError, Card>;
function storeCard(db: DB, card: Card): Task<DBError, Card>;
function storeCard(db: DB, card?: Card) {
  const doit = (card: Card): Task<DBError, Card> => {
    const data = encodeCard(card);
    const key = getKey(card.id, db);
    return setItem(key, data).map(always(card));
  };

  return typeof card === 'undefined' ? doit : doit(card);
}

export const openDB = (instanceID: InstanceID): Task<DBError, DB> =>
  Task.succeed({ instanceID });

export const createDB = (instanceID?: InstanceID): Task<DBError, DB> => {
  const id = fromNullable(instanceID).getOrElse(createGUID);
  return clear.mapError<DBError>(identity).map(always(id)).andThen(openDB);
};

export function getCard(id: GUID): (db: DB) => Task<DBError, Card>;
export function getCard(id: GUID, db: DB): Task<DBError, Card>;
export function getCard(id: GUID, db?: DB) {
  const doit = (db: DB) => {
    const key = getKey(id, db);
    return getItem(key).mapError<DBError>(identity).andThen<Card>(decodeCard);
  };

  return typeof db === 'undefined' ? doit : doit(db);
}

export const getCards = (db: DB): Task<DBError, ReadonlyArray<Card>> =>
  allItems(byNamespace(db)).map((items) =>
    mapMaybe(
      (s) => cardDecoder.decodeJson(s).map(just).getOrElse(nothing),
      items
    )
  );

export function deleteCard(card: Card): (db: DB) => Task<DBError, Card>;
export function deleteCard(card: Card, db: DB): Task<DBError, Card>;
export function deleteCard(card: Card, db?: DB) {
  const doit = (db: DB) => {
    const key = getKey(card.id, db);
    return removeItem(key).map(always(card)).mapError<DBError>(identity);
  };

  return typeof db === 'undefined' ? doit : doit(db);
}

export function addCard(details: CardData): (db: DB) => Task<DBError, Card>;
export function addCard(details: CardData, db: DB): Task<DBError, Card>;
export function addCard(details: CardData, db?: DB) {
  const doit = (db: DB) => {
    const card = createCard(details.name, details.position);
    return storeCard(db, card);
  };

  return typeof db === 'undefined' ? doit : doit(db);
}

export function updateCard(card: Card): (db: DB) => Task<DBError, Card>;
export function updateCard(card: Card, db: DB): Task<DBError, Card>;
export function updateCard(card: Card, db?: DB) {
  const doit = (db: DB) =>
    getCard(card.id, db)
      .and(mergeCards(card))
      .andThen(storeCard(db))
      .mapError<DBError>(identity);

  return typeof db === 'undefined' ? doit : doit(db);
}

export const moveCard = (
  card: Card,
  newLocation: Position,
  db: DB
): Task<DBError, Card> =>
  getCard(card.id, db)
    .and(mergeCards({ ...card, position: newLocation }))
    .andThen(storeCard(db));
