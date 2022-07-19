import { resourceDecoder } from "../exo_modules/Resource/Decoders";
import Decoder, { array, field, oneOf, string, succeed, date } from "jsonous";
import { Card, CardArrayResource, CardResource, CardType } from "./Types";
import { stringLiteral } from "@execonline-inc/decoders";
import { noop } from "mobx/lib/internal";
import Task from "taskarian";

const fromDecoderAny =
  <T>(decoder: Decoder<T>) =>
  (value: unknown): Task<string, T> =>
    new Task((reject, resolve) => {
      decoder.decodeAny(value).cata({ Ok: resolve, Err: reject });
      return noop;
    });

const cardTypeDecoder: Decoder<CardType> = oneOf<CardType>([
  stringLiteral<CardType>("TODO"),
  stringLiteral<CardType>("DONE"),
  stringLiteral<CardType>("IN_PROGRESS"),
]);

export const cardDecoder: Decoder<Card> = succeed({})
  .assign("id", field("id", string))
  .assign("name", field("name", string))
  .assign("description", field("description", string))
  .assign("status", field("status", cardTypeDecoder))
  .assign("created", field("created", date))
  .assign("lastUpdated", field("lastUpdated", date));

export const anyCardDecoder = fromDecoderAny(cardDecoder);

export const cardResourceDecoder: Decoder<CardResource> =
  resourceDecoder(cardDecoder);

export const cardArrayDecoder: Decoder<Card[]> = array(cardDecoder);

export const cardArrayResourceDecoder: Decoder<CardArrayResource> =
  resourceDecoder(cardArrayDecoder);
