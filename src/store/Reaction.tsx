import { observer } from "mobx-react";
import Task from "taskarian";
import { connectToKanbanDB, getCards } from "../utils/kanban.utils";
import Store, { assertNever } from "./index";
import ReactionComponent, { RCProps } from "./ReactionComponent";
import { State } from "./Types";
import { cardArrayDecoder, fromDecoderAny } from "./Decoders";

interface Props extends RCProps<Store> {
  store: Store;
}

const decodeCards = (cards: any) =>
  fromDecoderAny(cardArrayDecoder)(cards).mapError((e) => ({
    err: `decoder error ${e}`,
  }));

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
          .assign("db", connectToKanbanDB)
          .do(({ db }) => store.ready({ db: db }))
          .andThen(getCards)
          .andThen(decodeCards)
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
