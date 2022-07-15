import { find } from "@execonline-inc/collections";
import { toResult } from "@execonline-inc/maybe-adapter";
import {
  Link as LinkR,
  Resource as ResourceR,
  resource as resourceR,
} from "@execonline-inc/resource";
import { Result } from "resulty";

const rels = [] as const;

export type Rel = typeof rels[number];

export const toRel = (value: string): Result<string, Rel> =>
  toResult(
    `Expected to find an HTTP rel string. Instead I found ${value}`,
    find((rel) => rel === value, rels)
  );

export type Link = LinkR<Rel>;

export type Resource<T> = ResourceR<T, Rel>;

export const resource: <T>(
  links: ReadonlyArray<Link>,
  payload: T
) => Resource<T> = resourceR;
