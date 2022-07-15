import React from "react";
import "./App.css";
import { observer } from "mobx-react";
import CardColumns from "./components/card-columns";
import { DragDropContext } from "react-beautiful-dnd";
import Store from "./store";
import Reactions from "./store/Reaction";

interface Props {}

class App extends React.Component<Props> {
  store = new Store();

  render() {
    return (
      <>
        <CardColumns />
        <Reactions store={this.store} fireImmediately={true} />
      </>
    );
  }
}

export default App;
