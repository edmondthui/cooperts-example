import * as React from "react";
import "./delete.styles.css";
import { Droppable } from "react-beautiful-dnd";
import { observer } from "mobx-react";

interface Props {}

const getStyle = (provided: any) => {
  console.log(provided);
};

const Delete: React.FC<Props> = () => (
  <Droppable droppableId={"delete"}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        className="card-column"
        {...provided.droppableProps}
      >
        <>
          {getStyle(provided)}
          {provided.placeholder}
        </>
      </div>
    )}
  </Droppable>
);

export default observer(Delete);
