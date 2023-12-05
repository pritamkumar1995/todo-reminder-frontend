import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import axios from "axios";
import { removeTodos, updateTodos, completeTodos, addTodos } from "../redux/reducer";
import ToDosList from './ToDoList';
import { AnimatePresence, motion } from "framer-motion";
import loading from '../images/loading13.gif';

import "../css/displaytodo.css"


const mapStateToProps = (state) => {
    return {
      todos: state,
    };
  };
  
  const mapDispatchToProps = (dispatch) => {
    return {
      addToDo: (obj) => dispatch(addTodos(obj)),
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
    const [loadBool,setLoadBool] = useState(true);

    
    useEffect( () =>{
      console.log("props.todos.length : ",props.todos);
      if(props.todos.length===0){
          getTodoItems();
      }
    }, props.length)

    const getTodoItems = async () =>{
      let dataGet = {}
      console.log("coming inside...");
      try {
        await axios.get("https://todo-store-data-mongoose-backend.onrender.com/get_items").then((response) => {
          if(response && response.data){
          dataGet = response.data.todos;
          setLoadBool(false);
          if(dataGet.length!==0){
            dataGet.map((item)=>{
              let dataToAdd = {
                id: item.id,
                todo: item.todo,
                date: item.date,
                time: item.time,
                contact: item.contact,
                completed: item.completed
              }
              props.addToDo(dataToAdd);
            })
          }
        };
        });
      } catch (error) {
        console.error("error msg",error.response.data);
      }
    }


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
    <div>
        <div className='displaytodos'>
            <div className='button-list'>
            <button style={{'backgroundColor':ActiveColor, color:ActiveFont}} className='btn-active' onClick={OnActiveChange}> Active </button>
            <button style={{'backgroundColor':completeColor, color:completeFont}} className='btn-active' onClick={OnCompleteChange}> Complete </button>
            <button style={{'backgroundColor':AllColor, color:AllFont}} className='btn-active' onClick={OnAllChange}> All </button>
            </div>
            <div className='parent-div'>
               <AnimatePresence>
               {
                (loadBool===true ?<img className="load" src={loading} alt='gif-not-found'/>:'')
                }
                {
                (!loadBool && props.todos.length===0?<div className='Notodo'> <motion.h1 initial={{y:200}} animate={{y:0}} transition={{type: "spring" ,duration:2}} whileHover={{ scale: 1.06}}>You are not having any ToDo/Reminder, Add to see Here</motion.h1></div>:'')
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
      </div>
  )
}

export default connect(mapStateToProps,mapDispatchToProps)(DisplayToDo)