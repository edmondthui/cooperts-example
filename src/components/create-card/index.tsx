import { Maybe } from "maybeasy";
import { observer } from "mobx-react";
import React from "react";
import Modal from "react-modal";
import Store from "../../store";
import "./create-card.styles.css";

interface Props {
  store: Store;
  createString: Maybe<string>;
}

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

Modal.setAppElement("#root");

const onStringChange =
  (store: Store) => (e: React.ChangeEvent<HTMLInputElement>) => {
    store.setCreateString(e.target.value);
  };

const openModal = (store: Store, createString: string) => (e: any) => {
  e.preventDefault();
  if (createString.trim().length) {
    store.toggleModal(true);
  }
};

const closeModal = (store: Store) => (e: any) => {
  store.toggleModal(false);
};

class CreateCard extends React.Component<Props> {
  render() {
    return (
      <div className="create-card">
        <Modal
          isOpen={this.props.store.modalOpen}
          onRequestClose={closeModal(this.props.store)}
          style={customStyles}
          contentLabel="Create Card Modal"
        >
          <form onSubmit={() => {}} className="modal-form">
            <select onChange={() => {}} value={""}>
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
        <form
          onSubmit={openModal(
            this.props.store,
            this.props.createString.getOrElseValue("")
          )}
          className="create-card-form"
        >
          <input
            onChange={onStringChange(this.props.store)}
            value={this.props.createString.getOrElseValue("")}
            placeholder="e.g. Bug: TextPoll not dispatching half stars"
            maxLength={500}
          />
          <button>ADD NEW</button>
        </form>
      </div>
    );
  }
}

export default observer(CreateCard);

// const CreateCard = ({ updateCards }) => {
//     const [modalIsOpen, setIsOpen] = useState(false);
//     const [create, setCreateField] = useState("");
//     const [status, setStatus] = useState("");

// const onStringChange = (field) => {
//     return (e) => {
//         setCreateField(e.currentTarget.value);
//     };
// };

//     const statusHandler = (e) => {
//         setStatus(e.currentTarget.value);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (status) {
//             let card = { name: create, description: create, status: status };
//             connectToKanbanDB().then((db, dbInstanceId) => {
//                 db.addCard(card).then((cardId) => console.log(`successfully added card ${cardId}`));
//             });
//             setCreateField("");
//             setStatus("");
//             updateCards();
//             closeModal();
//         }
//     };

//     return (
// <div className="create-card">
//     <Modal isOpen={modalIsOpen} onAfterOpen={afterOpenModal} onRequestClose={closeModal} style={customStyles} contentLabel="Create Card Modal">
//         <form onSubmit={handleSubmit} className="modal-form">
//             <select onChange={statusHandler} value={status}>
//                 <option value="" disabled>
//                     SELECT STATUS
//                 </option>
//                 <option value="TODO">To-do</option>
//                 <option value="IN_PROGRESS">In Progress</option>
//                 <option value="DONE">Done</option>
//             </select>
//             <button>CREATE CARD</button>
//         </form>
//     </Modal>
//     <form onSubmit={openModal} className="create-card-form">
//         <input onChange={onStringChange("create")} value={create} placeholder="e.g. Bug: TextPoll not dispatching half stars" maxLength={500} />
//         <button>ADD NEW</button>
//     </form>
// </div>
//     );
// };

// export default CreateCard;
