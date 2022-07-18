// import { Resource } from "cooper-ts";
// import { Resource } from "../exo_modules/Resource/Types/index";

// export interface Card {
//   id: string; // maybe not needed
//   name: string;
//   description: string;
//   status: CardType;
//   created: Date; // UNIX timestamp
//   lastUpdated: Date; // UNIX timestamp
// }

// export type CardResource = Resource<Card>;

// export type CardArrayResource = Resource<Card[]>;

// export type CardType = "TODO" | "DOING" | "DONE" | "IN_PROGRESS";

export const waiting = (): Waiting => ({
  kind: "waiting",
  cards: [],
  db: undefined,
});

export const loading = (state: Waiting | Ready | Loading): Loading => {
  const { kind, ...previous } = state;
  return {
    kind: "loading",
    ...previous,
    createString: "",
    open: false,
  };
};

export const ready = (state: Loading | Ready): Ready => {
  const { kind, ...previous } = state;
  return {
    kind: "ready",
    ...previous,
  };
};

export const error = (message: string): Error => ({
  kind: "error",
  message,
});

interface Waiting {
  kind: "waiting";
  cards: any;
  db: any;
}

export interface Loading {
  kind: "loading";
  createString: string;
  cards: any;
  db: any;
  open: boolean;
}

interface Ready {
  kind: "ready";
  cards: any;
  db: any;
  createString: string;
  open: boolean;
}

interface Error {
  kind: "error";
  message: string;
}

export type State = Waiting | Loading | Ready | Error;
