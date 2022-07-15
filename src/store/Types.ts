// import { Resource } from "cooper-ts";
import { Resource } from "../exo_modules/Resource/Types/index";

export interface Card {
  // id: string; // maybe not needed
  name?: string | undefined;
  description?: string | undefined;
  status?: CardType | undefined;
  created?: string | undefined; // UNIX timestamp
  lastUpdated?: string | undefined; // UNIX timestamp
}

export type CardResource = Resource<Card>;

export type CardArrayResource = Resource<Card[]>;

export type CardType = "TODO" | "DOING" | "DONE" | "IN_PROGRESS";

export const waiting = (): Waiting => ({
  kind: "waiting",
});

export const loading = (state: Waiting | Ready | Loading): Loading => {
  const { kind, ...previous } = state;
  return {
    kind: "loading",
    ...previous,
  };
};

export const ready = (
  // sectionsListResource: SectionsListResource,
  state: Loading | Waiting
): Ready => {
  const { kind, ...previous } = state;
  return {
    kind: "ready",
    ...previous,
    // sectionsListResource: sectionsListResource,
  };
};

export const error = (message: string): Error => ({
  kind: "error",
  message,
});

interface Waiting {
  kind: "waiting";
}

export interface Loading {
  kind: "loading";
}

interface Ready {
  kind: "ready";
  // sectionsListResource: SectionsListResource;
}

interface Error {
  kind: "error";
  message: string;
}

export type State = Waiting | Loading | Ready | Error;
