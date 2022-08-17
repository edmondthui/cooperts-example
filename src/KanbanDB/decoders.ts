import { stringLiteral } from '@execonline-inc/decoders';
import Decoder, {
  dateISO,
  field,
  nullable,
  number,
  oneOf,
  string,
  succeed,
} from 'jsonous';
import { Card, CardStatus, Position } from './types';

export const cardStatusDecoder: Decoder<CardStatus> = oneOf([
  stringLiteral<CardStatus>('done'),
  stringLiteral<CardStatus>('in-progress'),
  stringLiteral<CardStatus>('todo'),
]);

export const positionDecoder: Decoder<Position> = succeed({})
  .assign('priority', field('priority', number))
  .assign('status', field('status', cardStatusDecoder));

export const statusOrPositionDecoders: Decoder<Position> = oneOf([
  field(
    'status',
    cardStatusDecoder.map((status) => ({ status, priority: 0 }))
  ),
  field('position', positionDecoder),
]);

export const cardDecoder: Decoder<Card> = succeed({})
  .assign('id', field('id', string))
  .assign('name', field('name', string))
  .assign('description', field('description', nullable(string)))
  .assign('position', statusOrPositionDecoders)
  .assign('updatedAt', field('updatedAt', dateISO))
  .assign('createdAt', field('createdAt', dateISO))
  .elseDo((msg) => console.warn(msg));
