import { observer } from "mobx-react";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import "./card.styles.css";
import Store from "../../store";

interface Props {
  card: any;
  index: number;
}

const getCardStyle = (isDragging: any, draggableStyle: any) => {
  if (isDragging && draggableStyle.transform !== null)
    draggableStyle.transform += " rotate(10deg)";
  return { ...draggableStyle };
};

// const handleDelete = () => {
//   connectToKanbanDB().then((db, dbInstanceId) => {
//     db.deleteCardById(cardId).then((bool) =>
//       console.log(`successfully deleted card ${bool}`)
//     );

//     setCardId("");
//     updateCards();
//     closeModal();
//   });
// };
// will probably make a new droppable garbage can component that will handle delete

const Card: React.FC<Props> = ({ card, index }) => (
  <Draggable draggableId={card.id} index={index}>
    {(provided, snapshot) => (
      <div
        className="card"
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        id={card.id}
        style={getCardStyle(snapshot.isDragging, provided.draggableProps.style)}
      >
        {card.description}
      </div>
    )}
  </Draggable>
);

export default observer(Card);
