import { HttpError } from "ajaxian";
import { observer } from "mobx-react";
import Task from "taskarian";
import Store from ".";
import { State, Card } from "./Types";
import ReactionComponent, { RCProps } from "./ReactionComponent";
import { assertNever } from "./index";
import { connectToKanbanDB } from "../utils/kanban.utils";
// import { cardArrayResourceDecoder } from "./Decoders";
import Decoder from "jsonous";
import { noop } from "@kofno/piper";

interface Props extends RCProps<Store> {
  store: Store;
}

const getCards = (db: any) => {
  console.log("get cards");
  return new Task((reject, resolve) => {
    db.getCards()
      .then((cards: any) => {
        console.log(cards);
        resolve(cards);
      })
      .catch((error: any) => reject(error));
    return noop;
  });
};

class Reactions extends ReactionComponent<Store, State, Props> {
  tester = () => this.props.store.state;
  effect = (state: State) => {
    const { store } = this.props;
    switch (state.kind) {
      case "waiting":
        console.log("waiting");
        store.load();
        break;
      case "loading":
        console.log("loading");
        Task.fromPromise(connectToKanbanDB)
          .andThen(getCards)
          .fork(
            (err) => console.log(err),
            (result) => console.log(result)
          );

        break;
      case "ready":
      case "error":
        break;
      default:
        assertNever(state);
    }
  };
}

export default observer(Reactions);
