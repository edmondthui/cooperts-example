import React, { Component } from "react";
import "./card-column.styles.css";
import { Droppable } from "react-beautiful-dnd";
import Card from "../card/card.component";

class CardColumn extends Component {

    render() {
        const { cards, status, updateCards } = this.props;

        return (         
            <Droppable droppableId={status}>
                {(provided) => (
                    <div ref={provided.innerRef} className="card-column" {...provided.droppableProps}>
                        {cards.map((card, index) => {
                            return <Card updateCards={updateCards} card={card} index={index} key={card.id} />;
                        })}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        );
    }
}

export default CardColumn;
