import React, { useState, Fragment } from "react";
import { Draggable } from "react-beautiful-dnd";
import "./card.styles.css";
import Modal from "react-modal";
import { connectToKanbanDB } from "../../utils/kanban.utils.js";


Modal.setAppElement("#root");

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        width: "50%",
        height: "50%",
        boxShadow: "0px 2px 5px 5px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
};

const Card = ({ card, index, updateCards }) => {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [cardId, setCardId] = useState("");
    const [cardName, setCardName] = useState(card.name);
    const [cardDescription, setCardDescription] = useState(card.description);

    const getCardStyle = (isDragging, draggableStyle) => {
        if (isDragging && draggableStyle.transform !== null) draggableStyle.transform += " rotate(10deg)";
        return { ...draggableStyle };
    };

    const openModal = (e) => {
        setIsOpen(true);
        console.log(e.currentTarget.id);
        setCardId(e.currentTarget.id);
    };

    const afterOpenModal = () => {};

    const closeModal = () => {
        setIsOpen(false);
    };

    const handleDelete = () => {
        connectToKanbanDB().then((db, dbInstanceId) => {
            db.deleteCardById(cardId).then((bool) => console.log(`successfully deleted card ${bool}`));

            setCardId("");
            updateCards();
            closeModal();
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        const cardData = { name: cardName, description: cardDescription, status: card.status };
        connectToKanbanDB().then((db, dbInstanceId) => {
            db.updateCardById(cardId, cardData);
            updateCards();
            closeModal();
        })
    }

    const onCardNameChange = (e) => {
        setCardName(e.currentTarget.value);
    }

    const onCardDescriptionChange = (e) => {
        setCardDescription(e.currentTarget.value);
    };

    return (
        <Fragment>
            <Modal isOpen={modalIsOpen} onAfterOpen={afterOpenModal} onRequestClose={closeModal} style={customStyles} contentLabel="Delete Card Modal">
                <form onSubmit={handleUpdate} className="modal-form">
                    <label htmlFor="name">Name</label>
                    <input name="name" value={cardName} onChange={onCardNameChange} maxLength={500}/>
                    <label htmlFor="description">Description</label>
                    <input name="description" value={cardDescription} onChange={onCardDescriptionChange} maxLength={500}/>
                    <button className="update-card">
                            UPDATE CARD
                    </button>
                </form>    
                <button className="delete-card" onClick={handleDelete}>
                    DELETE CARD
                </button>
            </Modal>
            <Draggable draggableId={card.id} index={index}>
                {(provided, snapshot) => (
                    <div
                        onClick={openModal}
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
        </Fragment>
    );
};

// class Card extends Component {
//     render() {
//         const { card, index } = this.props;
//         return (
//             <Draggable draggableId={card.id} index={index} key={card.id}>
//                 {(provided) => (
//                     <div className="card" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
//                         {card.description}
//                     </div>
//                 )}
//             </Draggable>
//         );
//     }
// }

export default Card;
