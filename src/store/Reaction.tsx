import { HttpError } from "ajaxian";
import { observer } from "mobx-react";
import Task from "taskarian";
import Store from ".";
import { State } from "./Types";
import ReactionComponent, { RCProps } from "./ReactionComponent";
import { assertNever } from "./index";

interface Props extends RCProps<Store> {
  store: Store;
}

class SectionListReactions extends ReactionComponent<Store, State, Props> {
  tester = () => this.props.store.state;
  effect = (state: State) => {
    const { store } = this.props;
    switch (state.kind) {
      case "waiting":
        store.load();
        break;
      case "ready":
      case "error":
        break;
      case "loading":
        // fetch from kanban db
        break;
      default:
        assertNever(state);
    }
  };
}

export default observer(SectionListReactions);
