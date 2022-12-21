import { useState, useEffect } from "react";
import React, {Component} from "react";
const API_BASE = "http://localhost:3001";
import Modal from 'react-modal';



function App() {
  const [todos, setTodos] = useState([]);
  const [popUpActive, setPopUpActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  
  const openModal = () => {
    setModalIsOpen(true);
  }

  const closeModal = () => {
    setModalIsOpen(false);
  }
  
  useEffect(() => {
    GetTodos();
    console.log(todos);
  }, []);

  const GetTodos = () => {
    fetch(API_BASE + "/todos")
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.log("Error: ", err));
  }

  const completeTodo= async id => {
    const data = await fetch(API_BASE + "/todo/complete/" + id)
      .then(res => res.json());

    setTodos(todos => todos.map(todo => {
      if (todo._id === data._id) {
        todo.complete = data.complete
      }
      return todo;
    }));
  }

  const deleteTodo = async id => {
    const data = await fetch(API_BASE + "/todo/delete/" + id, { method: "DELETE" })
      .then(res => res.json());

    setTodos(todos => todos.filter(todo => todo._id  !== data._id));
  }

  const addTodo = async () => {
    try {
      const data = await fetch(API_BASE + "/todo/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: newTodo
        })
      }).then(res => res.json());
      setTodos([...todos, data]);
      setPopUpActive(false);
      setNewTodo("");
      closeModal();
    } catch (err) {
      console.log(err.message);
    }    
  }
  
  return (
    <div className="App">
      <h1>Welcome Meljohn!</h1>
      <h3>Your Tasks</h3>

      <div className="todos">
        {todos.map(todo => (
          <div className={"todo " + (todo.complete ? "is-complete" : "")} 
            key={todo._id}
            onClick= {() => completeTodo(todo._id)}  
          >
            <div className="text">{ todo.text }</div>
            <div 
              className="delete-todo"
              onClick={() => deleteTodo(todo._id)}
            >X</div>
        </div>
        ))}
        
      </div>
      <div className="addPopUp"
        onClick={openModal}
      >+</div>

      <Modal className="modal-overlay" isOpen={modalIsOpen} onRequestClose={closeModal}>
      <div className="popUp">
          <div className="modal-close"
            onClick={closeModal}
          >X</div>
          <div className="modal" isOpen={modalIsOpen} onRequestClose={closeModal}>
            <h3>Add Task</h3>
            <input type="text" className="add-todo-input"
              onChange={e => setNewTodo(e.target.value) }
              value = {newTodo}
            />
            <button className="add-todo-btn"
              disabled={!newTodo}
              onClick={addTodo}
            >Add To Do</button>
          </div>
      </div>
      </Modal>
    </div>
    
  )
}

export default App
