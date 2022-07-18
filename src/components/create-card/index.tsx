import { Maybe } from "maybeasy";
import { observer } from "mobx-react";
import React from "react";
import Modal from "react-modal";
import Task from "taskarian";
import Store from "../../store";
import "./create-card.styles.css";
import { getCards } from "../../utils/kanban.utils";

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

const handleSubmit =
  (store: Store) => (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let card = {
      name: store.createString.getOrElseValue(""),
      description: store.createString.getOrElseValue(""),
      status: store.status,
    };
    if (card.status.length > 0) {
      Task.fromPromise(() => store.db.addCard(card)).fork(
        (err) => console.log(err),
        (success) => {
          store.addCard(card);
        }
      );
    } else {
      console.log("status required!");
      // store.error({ message: "Card status required!" });
    }
  };

const statusHandler =
  (store: Store) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    store.setStatus(e.target.value);
  };

class CreateCard extends React.Component<Props> {
  render() {
    const store = this.props.store;
    return (
      <div className="create-card">
        <Modal
          isOpen={store.modalOpen}
          onRequestClose={closeModal(store)}
          style={customStyles}
          contentLabel="Create Card Modal"
        >
          <form onSubmit={handleSubmit(store)} className="modal-form">
            <select onChange={statusHandler(store)} value={store.status}>
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
          onSubmit={openModal(store, store.createString.getOrElseValue(""))}
          className="create-card-form"
        >
          <input
            onChange={onStringChange(store)}
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
