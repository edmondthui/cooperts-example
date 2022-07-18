import { observer } from "mobx-react";
import Task from "taskarian";
import { connectToKanbanDB } from "../utils/kanban.utils";
import Store, { assertNever } from "./index";
import ReactionComponent, { RCProps } from "./ReactionComponent";
import { State } from "./Types";
// import { cardArrayResourceDecoder } from "./Decoders";
import { noop } from "@kofno/piper";

interface Props extends RCProps<Store> {
  store: Store;
}

const getCards = (db: any) => {
  return new Task((reject, resolve) => {
    db.getCards()
      .then((cards: any) => {
        resolve({ cards: cards, db: db });
      })
      .catch((error: any) => reject(db));
    return noop;
  });
};

class Reactions extends ReactionComponent<Store, State, Props> {
  tester = () => this.props.store.state;
  effect = (state: State) => {
    const { store } = this.props;
    switch (state.kind) {
      case "waiting":
        store.load();
        break;
      case "loading":
        Task.fromPromise(connectToKanbanDB)
          .andThen(getCards)
          .fork(
            (db) => store.ready({ cards: [], db: db }),
            (result) => {
              store.ready(result);
            }
          );
        store.ready({ cards: [], db: undefined });
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
