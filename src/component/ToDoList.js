import React, { useRef} from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import { motion } from "framer-motion";

import { removeTodos, updateTodos, completeTodos } from "../redux/reducer";

import "../css/todolist.css";

const mapStateToProps = (state) => {
  return {
    todos: state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    removeTodo: (id) => dispatch(removeTodos(id)),
    updateTodo: (obj) => dispatch(updateTodos(obj)),
    completedTodo: (id) => dispatch(completeTodos(id)),
  };
};

function ToDosList(props) {
  const inputRef = useRef(true);
  const changeFocus = () => {
    inputRef.current.disabled = false;
    inputRef.current.focus();
  };
  const deleteDataId = (id) => {
    confirmAlert({
      title: "Confirm to Submit",
      message: "Are you sure You want to Delete This ?",
      buttons: [
        {
          label: "Yes",
          onClick:  async () => {
            const data = {id};
            try {
              console.log("props.id sent ",id);
              props.removeTodo(props.item.id);
              return await axios.delete("https://todo-store-data-mongoose-backend.onrender.com/delete_item", {data}).then((response) => {
                if(response){
                  toast.success("ToDo/Reminder Deleted Successfully !");
                }
              });
             
            } catch (error) {
              toast.error("Sorry due to some issue ToDo/Reminder is not deleted ");
              console.error(error.response.data);
            }
          },
        },
        {
          label: "No",
          onClick: () => {
            return;
          },
        },
      ],
    });
  };
  const completeTaskId = async (dataToSend) => {
    const data ={};
    data.id = dataToSend.item.id;
    data.value = {"completed": true};
    return await axios.patch("https://todo-store-data-mongoose-backend.onrender.com/update_item", data).then((response) => {
      if(response){
        props.completedTodo(dataToSend.item.id);
        toast.success("ToDo/Reminder Completed Successfully !");
      }
    })};
  const update = async (id, value, e) => {
    const data ={};
    if (e.which === 13) {
      console.log("updated value ", value);
      data.id = id;
      data.value = {"todo":value};
      inputRef.current.disabled = true;
      return await axios.patch("https://todo-store-data-mongoose-backend.onrender.com/update_item", data).then((response) => {
        if(response){
          props.updateTodo({ id, todo: value });
          toast.success("ToDo/Reminder Updated Successfully !");
        }
      });
        
    }
  };

  return (
    <motion.div
      initial={{x:"150vw",
      transition:{ type: "spring", duration: 2.5 }
      }}
      animate={{x:0,
      transition:{ type: "spring", duration: 2.5 }
      }}
      whileHover={{ scale: 0.9 }}
      transition={{ type: "spring", duration: 0.2 }}
      exit={{
        x: "-60vw",
        scale: [1,0],
        transition:{ type: "spring", duration: 0.5 },
      }}
      className="wrapper"
      key={props.item.id}
    >
      <div className="parent-display-box">
        <div className="displaybox">
          <div className="textarea-edit-parent">
            <textarea
              className="text-area-field"
              ref={inputRef}
              disabled={inputRef}
              defaultValue={props.item.todo}
              onKeyPress={(e) =>
                update(props.item.id, inputRef.current.value, e)
              }
            />
          </div>
          <div className="item-display-date">{props.item.date}</div>
          <div className="item-display-time">{props.item.time}</div>
          <div className="button-delete-comp">
            <motion.button
              whileHover={{ scale: 1.5 }}
              whileTap={{ scale: 0.8 }}
              style={{ color: "black" }}
              className="btn-edit"
              onClick={() => {
                changeFocus();
              }}
            >
              Edit
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.5 }}
              whileTap={{ scale: 0.8 }}
              style={{ color: "red" }}
              className="btn-delete"
              onClick={() => deleteDataId(props.item.id)}
            >
              Delete
            </motion.button>
            {props.item.completed === false && (
              <motion.button
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.8 }}
                style={{ color: "green" }}
                className="btn-complete"
                onClick={() => completeTaskId(props)}
              >
                Complete
              </motion.button>
            )}
          </div>
        </div>
        {props.item.completed && <div className="done-task-mark">Done</div>}
      </div>
    </motion.div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ToDosList);
