import React, { useState, useEffect } from "react";
import { TimePicker } from "react-ios-time-picker";
import { DatePicker } from "react-rainbow-components";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { connect } from "react-redux";
import { addTodos } from "../redux/reducer";

const mapStateToProps = (state) => {
  return {
    todos: state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToDo: (obj) => dispatch(addTodos(obj)),
  };
};
const ToDos = (props) => {
  const [toDo, setToDo] = useState("");
  const [dateValue, setStartDate] = useState(null);
  const [time, setTime] = useState("00:00");
  const [toCheckDate, setCheckDate] = useState(false);
  const [toContact, setToContact] = useState(null);
  const [trigger, setTrigger] = useState(false);
  const date = new Date();
  const dateWithoutTime = new Date(date.getTime()).setHours(0, 0, 0, 0);

  useEffect(
    () => {
      if (trigger) {
        const response = postRequest();
        console.log("first-todo", response);
        console.log("first-todo", props.todos);
      }
    },
    [props.todos],
    trigger
  );

  const postRequest = async () => {
    try {
      return await axios.post("/contact", props.todos);
    } catch (error) {
      console.error(error.response.data);
    }
  };
  function compareTime(userInput) {
    // Get the hour, minute, and seconds from the user input time.
    const userHours = parseInt(userInput.substring(0, 2));
    const userMinutes = parseInt(userInput.substring(3, 5));
    const userSeconds = parseInt("0");
    // Get the hour, minute, and seconds from the user current time.
    const currentHours = new Date().getHours();
    const currentMinutes = new Date().getMinutes();
    const currentSeconds = new Date().getSeconds();
    // Create a Date object for the user input time.
    const userDate = new Date(0, 0, 0, userHours, userMinutes, userSeconds);
    // Create a Date object for the current time.
    const currentDate = new Date(
      0,
      0,
      0,
      currentHours,
      currentMinutes,
      currentSeconds
    );
    // Compare the two Date objects.
    if (userDate > currentDate) {
      return "future";
    } else {
      return "past";
    }
  }

  const handleOnChange = (e) => {
    setToDo(e.target.value);
  };

  const onChange = (timeValue) => {
    setTime(timeValue);
  };

  const handleChangedNumber = (e) => {
    setToContact(e.target.value);
  };

  const checkCheckBox = () => {
    let daily = document.getElementById("one");
    let specific = document.getElementById("two");
    if (daily.checked !== true && specific.checked !== true) {
      return false;
    }
    return true;
  };

  const handleCheckBoxDaily = () => {
    let unselect = document.getElementById("two");
    unselect.checked = false;
    let select = document.getElementById("one");
    if (select.checked !== true) {
      unselect.checked = true;
      setCheckDate(true);
      return;
    }
    setCheckDate(false);
  };

  const handleCheckBoxSpecific = () => {
    let unselect = document.getElementById("one");
    unselect.checked = false;
    let select = document.getElementById("two");
    if (select.checked !== true) {
      unselect.checked = true;
      setCheckDate(false);
      return;
    }
    setCheckDate(true);
  };

  const handleSubmit = () => {
    if (toDo === "") {
      toast.error("You may need to add ToDo/Reminder Message");
      return;
    }
    const flagCheckBox = checkCheckBox();
    if (flagCheckBox === false) {
      toast.error("You may need choose Daily/Specific Schedule");
      return;
    }
    if (dateValue !== null && dateValue < dateWithoutTime) {
      toast.error("Sorry Add the Upcoming Or Today's Date !");
      return;
    }
    const resultString = compareTime(time);

    if (
      resultString === "past" &&
      Number(dateValue) === new Date().setHours(0, 0, 0, 0)
    ) {
      toast.error("Sorry Add the Correct Time !");
      return;
    }
    const setDateValue = dateValue ? dateValue.toString() : null;
    const result = setDateValue ? setDateValue.split(/(\s+)/) : null;
    let res = "";
    if (result !== null) {
      result.splice(7, 10);
      for (let i = 0; i < result.length; i++) {
        res = res + result[i];
      }
    }
    if (toContact === null) setToContact("no-contact available");
    if (res === "") res = "Daily Snooze ";
    props.addToDo({
      id: Math.floor(Math.random() * 1000),
      item: toDo,
      date: res,
      time: time,
      contact: toContact,
      completed: false,
    });
    toast.success("ToDo/Reminder added successfully!");
    setToDo("");
    setStartDate(null);
    setToContact("");
    setTrigger(true);
  };

  return (
    <div className="addTodos">
      <div className="addTodos-sub">
        <form className="form-wrapper">
          <div className="label-text-add"></div>
          <input
            className="todo-input"
            type="text"
            onChange={handleOnChange}
            placeholder=" ✏️ Add your to-Do/Reminder"
            value={toDo}
          />
          <div className="checkbox-container">
            <span className="daily-checkbox">
              <input
                id="one"
                className="check-select-daily"
                type="checkbox"
                onChange={handleCheckBoxDaily}
              />
              <label className="label-text-checkbox">Daily</label>
            </span>
            <span className="specific-checkbox">
              <input
                id="two"
                className="check-select-specific"
                type="checkbox"
                onChange={handleCheckBoxSpecific}
              />
              <label className="label-text-checkbox">Specific-Date</label>
            </span>
          </div>
          {toCheckDate ? (
            <div className="date-container">
              <div className="label-text-date">
                Select Date :
                <div className="date-child">
                  <DatePicker
                    className="date-style"
                    onChange={(date) => setStartDate(date)}
                    value={dateValue}
                  />
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="label-text-time">
            Choose Time :
            <span className="time-picker-parent">
              <TimePicker
                wrapperClassName="datePicker"
                value={time}
                onChange={onChange}
              />
            </span>
          </div>
          <div className="input-number-div">
            <div className="label-text-contact">
              Contact No. :
              <input
                className="todo-input-number"
                type="text"
                onChange={handleChangedNumber}
                placeholder=" 📞  Add your Contact No."
                value={toContact}
              />
            </div>
          </div>
        </form>
        <div className="add-button-parent">
          <button onClick={handleSubmit} class="button-arounder">Add</button>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ToDos);
