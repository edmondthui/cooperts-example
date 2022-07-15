import { action, computed, observable } from "mobx";
import { just, Maybe, nothing } from "maybeasy";
import {
  error,
  loading,
  ready,
  State,
  waiting,
  Card,
  CardArrayResource,
} from "./Types";

export const assertNever = (x: never) => {
  throw new Error(`Unexpected object: ${x}`);
};

class Store {
  @observable
  state: State = waiting();

  @action
  load = () => {
    switch (this.state.kind) {
      case "waiting":
        this.state = loading(this.state);
      case "ready":
      case "loading":
      case "error":
        break;
      default:
        assertNever(this.state);
    }
  };

  @action
  ready = (cards: CardArrayResource) => {
    switch (this.state.kind) {
      case "ready":
      case "error":
      case "waiting":
      case "loading":
        console.log(cards);
        break;
      default:
        assertNever(this.state);
    }
  };

  @action
  error = (err: any) => {
    this.state = error(
      `Request failed due to '${err.kind}'. Please try again later.`
    );
  };

  @computed
  get errorMessage(): Maybe<string> {
    switch (this.state.kind) {
      case "error":
        return just(this.state.message);
      case "ready":
      case "loading":
      case "waiting":
        return nothing();
    }
  }
}

export default Store;
