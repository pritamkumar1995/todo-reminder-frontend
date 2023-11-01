import React, { useState } from 'react';
import { connect } from "react-redux";
import { removeTodos, updateTodos, completeTodos } from "../redux/reducer";
import ToDosList from './ToDoList';
import { AnimatePresence, motion } from "framer-motion"

import "../css/displaytodo.css"


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

function DisplayToDo(props) {
    const [sort,setsort] = useState("active");
    const [ActiveColor, setColorActive] = useState("#313131");
    const [ActiveFont, setFontActive] = useState("#e1ebfd");
    const [AllColor, setColorAll] = useState("transparent");
    const [AllFont, setFontAll] = useState("black");
    const [completeColor, setCompleteColor] = useState("transparent");
    const [completeFont, setCompleteFont] = useState("black");
    const [bool,setBool]= useState(false);
    const OnActiveChange = () =>{
      setsort("active");
      setColorActive("#313131");
      setFontActive("#e1ebfd");
      setCompleteColor("transparent");
      setCompleteFont("black");
      setColorAll("transparent");
      setFontAll("black");

    }

    const OnCompleteChange = () =>{
      setsort("completed");
      setCompleteColor("#313131");
      setCompleteFont("#e1ebfd");
      setColorActive("transparent");
      setFontActive("black");
      setColorAll("transparent");
      setFontAll("black");
    }
    const OnAllChange = () =>{
      setsort("all");
      setColorAll("#313131");
      setFontAll("#e1ebfd");
      setColorActive("transparent");
      setFontActive("black");
      setCompleteColor("transparent");
      setCompleteFont("black");
    }
  return (
        <div className='displaytodos'>
            <div className='button-list'>
            <button style={{'background-color':ActiveColor, color:ActiveFont}} className='btn-active' onClick={OnActiveChange}> Active </button>
            <button style={{'background-color':completeColor, color:completeFont}} className='btn-active' onClick={OnCompleteChange}> Complete </button>
            <button style={{'background-color':AllColor, color:AllFont}} className='btn-active' onClick={OnAllChange}> All </button>
            </div>
            <div className='parent-div'>
               <AnimatePresence>
               {
                  props.todos.length===0?<div className='Notodo'> <motion.h1 initial={{y:200}} animate={{y:0}} transition={{type: "spring" ,duration:2}} whileHover={{ scale: 1.06}}>You are not having any ToDo/Reminder, Add to see Here</motion.h1></div>:null
                }
                {
                    props.todos.length > 0 && sort === "active" ?
                    props.todos.map(item=>{

                        return (
                            item.completed === false && <ToDosList 
                              key={item.id}
                              item={item}
                              removeTodo={props.removeTodo}
                              updateTodo={props.updateTodo}
                              completedTodo={props.completedTodo}
                            />
                        )
                    }): null
                }
                 {
                    props.todos.length > 0 && sort === "completed" ?
                    props.todos.map(item=>{
                        return (
                            item.completed === true && <ToDosList 
                              key={item.id}
                              item={item}
                              removeTodo={props.removeTodo}
                              updateTodo={props.updateTodo}
                              completedTodo={props.completedTodo}
                            />
                        )
                    }): null
                }
                {
                    props.todos.length > 0 && sort === "all" ?
                    props.todos.map(item=>{
                        return (
                            <ToDosList 
                              key={item.id}
                              item={item}
                              removeTodo={props.removeTodo}
                              updateTodo={props.updateTodo}
                              completedTodo={props.completedTodo}
                            />
                        )
                    }): null
                }
               </AnimatePresence>
            </div>
        </div>
  )
}

export default connect(mapStateToProps,mapDispatchToProps)(DisplayToDo)