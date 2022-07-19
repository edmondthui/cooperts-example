import { observer } from "mobx-react";
import Task from "taskarian";
import { connectToKanbanDB, getCards } from "../utils/kanban.utils";
import Store, { assertNever } from "./index";
import ReactionComponent, { RCProps } from "./ReactionComponent";
import { State } from "./Types";
// import { cardArrayResourceDecoder } from "./Decoders";

interface Props extends RCProps<Store> {
  store: Store;
}

const loadDB = () => {
  return Task.fromPromise(connectToKanbanDB);
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
        Task.succeed<any, {}>({})
          .assign("db", loadDB)
          .do(({ db }) => store.ready({ db: db }))
          .andThen(getCards)
          .do((cards) => store.setCards(cards))
          .fork(
            (err) => console.log(err),
            (success) => console.log(success)
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
