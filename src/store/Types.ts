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
});

export const loading = (state: Waiting | Ready | Loading): Loading => {
  const { kind, ...previous } = state;
  return {
    kind: "loading",
    ...previous,
    createString: "",
    open: false,
    status: "",
    todo: [],
    inProgress: [],
    done: [],
    db: undefined,
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
}

export interface Loading {
  kind: "loading";
  createString: string;
  todo: Array<any>;
  inProgress: Array<any>;
  done: Array<any>;
  db: any;
  open: boolean;
  status: string;
}

interface Ready {
  kind: "ready";
  todo: Array<any>;
  inProgress: Array<any>;
  done: Array<any>;
  db: any;
  createString: string;
  open: boolean;
  status: string;
}

interface Error {
  kind: "error";
  message: string;
}

export type State = Waiting | Loading | Ready | Error;
