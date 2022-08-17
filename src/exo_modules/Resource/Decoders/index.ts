import { resourceDecoder as resourceDecoderR } from "@execonline-inc/resource";
import Decoder from "jsonous";
import { Resource, toRel } from "../Types";

export const resourceDecoder: <T>(
  payloadDecoder: Decoder<T>
) => Decoder<Resource<T>> = resourceDecoderR(toRel);

export { errorDecoder } from "@execonline-inc/resource";