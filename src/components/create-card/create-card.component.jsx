import React, { useState } from "react";
import "./create-card.styles.css";
import { connectToKanbanDB } from "../../utils/kanban.utils.js";
import Modal from "react-modal";

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
        height: "25%",
        boxShadow: "0px 2px 5px 5px rgba(0, 0, 0, 0.1)",
    },
};

const CreateCard = ({ updateCards }) => {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [create, setCreateField] = useState("");
    const [status, setStatus] = useState("");

    const onStringChange = (field) => {
        return (e) => {
            setCreateField(e.currentTarget.value);
        };
    };

    function openModal(e) {
        e.preventDefault();
        if (create.length) {
            setIsOpen(true);
        }
    }

    function afterOpenModal() {}

    function closeModal() {
        setIsOpen(false);
    }

    const statusHandler = (e) => {
        setStatus(e.currentTarget.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (status) {
            let card = { name: create, description: create, status: status };
            connectToKanbanDB().then((db, dbInstanceId) => {
                db.addCard(card).then((cardId) => console.log(`successfully added card ${cardId}`));
            });
            setCreateField("");
            setStatus("");
            updateCards();
            closeModal();
        }
    };

    return (
        <div className="create-card">
            <Modal isOpen={modalIsOpen} onAfterOpen={afterOpenModal} onRequestClose={closeModal} style={customStyles} contentLabel="Create Card Modal">
                <form onSubmit={handleSubmit} className="modal-form">
                    <select onChange={statusHandler} value={status}>
                        <option value="" disabled>
                            SELECT STATUS
                        </option>
                        <option value="TODO">To-do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                    </select>
                    <button>CREATE CARD</button>
                </form>
            </Modal>
            <form onSubmit={openModal} className="create-card-form">
                <input onChange={onStringChange("create")} value={create} placeholder="e.g. Bug: TextPoll not dispatching half stars" maxLength={500} />
                <button>ADD NEW</button>
            </form>
        </div>
    );
};

export default CreateCard;
