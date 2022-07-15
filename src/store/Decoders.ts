import { resourceDecoder } from "../exo_modules/Resource/Decoders";
import Decoder, { array, field, number, oneOf, string, succeed } from "jsonous";
// import { Card, CardArrayResource, CardResource, CardType } from "./Types";
import { explicitMaybe, stringLiteral } from "@execonline-inc/decoders";

// const cardTypeDecoder: Decoder<CardType> = oneOf<CardType>([
//   stringLiteral<CardType>("TODO"),
//   stringLiteral<CardType>("DOING"),
//   stringLiteral<CardType>("DONE"),
//   stringLiteral<CardType>("IN_PROGRESS"),
// ]);

// export const cardDecoder: Decoder<Card> = succeed({})
//   .assign("id", field("id", string))
//   .assign("name", field("name", string))
//   .assign("description", field("description", explicitMaybe(string)))
//   .assign("status", field("status", cardTypeDecoder))
//   .assign("created", field("created", string))
//   .assign("lastUpdated", field("lastUpdated", string));

// export const cardResourceDecoder: Decoder<CardResource> =
//   resourceDecoder(cardDecoder);

// export const cardArrayDecoder: Decoder<Card[]> = array(cardDecoder);

// export const cardArrayResourceDecoder: Decoder<CardArrayResource> =
//   resourceDecoder(cardArrayDecoder);
