import { action, computed, observable } from "mobx";
import { just, Maybe, nothing } from "maybeasy";
import { error, loading, ready, State, waiting } from "./Types";

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
        break;
      case "ready":
      case "loading":
      case "error":
        break;
      default:
        assertNever(this.state);
    }
  };

  @action
  ready = (data: any) => {
    switch (this.state.kind) {
      case "ready":
      case "error":
      case "waiting":
        break;
      case "loading":
        this.state = ready(this.state);
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

  @action
  setCreateString = (string: string) => {
    switch (this.state.kind) {
      case "ready":
        this.state.createString = string;
        break;
      case "error":
      case "waiting":
      case "loading":
        break;
      default:
        assertNever(this.state);
    }
  };

  @action
  toggleModal = (isOpen: boolean) => {
    switch (this.state.kind) {
      case "ready":
        console.log("toggle");
        console.log(isOpen);
        this.state.open = isOpen;
        break;
      case "error":
      case "waiting":
      case "loading":
        break;
      default:
        assertNever(this.state);
    }
  };

  @computed
  get createString(): Maybe<string> {
    switch (this.state.kind) {
      case "ready":
      case "loading":
        return just(this.state.createString);
      case "waiting":
      case "error":
      default:
        return nothing();
    }
  }

  @computed
  get modalOpen(): boolean {
    switch (this.state.kind) {
      case "ready":
      case "loading":
        return this.state.open;
      case "waiting":
      case "error":
      default:
        return false;
    }
  }

  @computed
  get errorMessage(): Maybe<string> {
    switch (this.state.kind) {
      case "error":
        return just(this.state.message);
      case "ready":
      case "loading":
      case "waiting":
      default:
        return nothing();
    }
  }

  @computed
  get cards(): Maybe<any[]> {
    switch (this.state.kind) {
      case "ready":
        return just(this.state.cards);
      case "error":
      case "loading":
      case "waiting":
      default:
        return nothing();
    }
  }
}

export default Store;
