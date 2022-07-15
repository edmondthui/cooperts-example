// ADD CARD TYPES

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
  sectionsListResource: SectionsListResource,
  state: Loading | Sorting | Waiting
): Ready => {
  const { kind, ...previous } = state;
  return {
    kind: "ready",
    ...previous,
    sectionsListResource: sectionsListResource,
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
  sectionsListResource: SectionsListResource;
  page: number;
}

interface Error {
  kind: "error";
  message: string;
}

export type State = Waiting | Loading | Ready | Error;
