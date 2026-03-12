"use client";
import ListItem from "./listItem";
import { useState, useEffect } from "react";
import { nanoid } from "nanoid"; // this is just for generating random ids

import { collection, addDoc, doc, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from '../config/firebase'

// Initial list of To-Do tasks -- hmm.... these are all hardcoded... maybe we can try retreiving this from a database? 
export default function Todo() {
  const tasks = [
    {
      id: "1",
      task: "✨ Plan for upcoming board meeting",
      status: false,
      active: false,
      editMode: false,
    },
    {
      id: "2",
      task: "📄 Reserve room",
      status: false,
      active: false,
      editMode: false,
    },
    {
      id: "3",
      task: "🤝 Schedule meeting with professors",
      status: false,
      active: false,
      editMode: false,
    },
    {
      id: "4",
      task: "🥘 Order food for GBM",
      status: false,
      active: false,
      editMode: false,
    },
    {
      id: "5",
      task: "🔥 Firebase workshop!",
      status: false,
      active: false,
      editMode: false,
    },
  ];

  // ----------------------------- STATES ----------------------------

  // const [myTasks, setTasks] = useState(tasks); // array of our tasks
  const [myTasks, setTasks] = useState([]);
  const [input, setInput] = useState(""); // input for adding a to-do item

  // ----------------------------- A BUNCH OF FUNCTIONS  ----------------------------

  // (GET API) Run this to update the tasksArray each time a add/update/edit change is made to the database because of the onSnapshot listener
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), 
    
    (snapshot) => {
      const tasksArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      setTasks(tasksArray);
    });
  
    return () => unsubscribe();
  }, []);


  // FUNCTION: when you click "add to-do", it calls this function

  // OLD FUNCTION
  // function handleAddTodo() {
  //   const newTask = { id: `todo-${nanoid()}`, task: input, status: false };
  //   if (input.length > 0) {
  //     setTasks([...myTasks, newTask]);
  //     setInput("");
  //   }
  // }

  // POST API: NEW FUNCTION
  const postData = async () => {
    try {
      const docRef = await addDoc(collection(db, 'tasks'), {
        task: input,
        status: false,
        active: false,
        editMode: false,
        timestamp: new Date(),
      });
      console.log('Document written with ID: ', docRef.id);
      setInput('');
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  // FUNCTION: when you click on a TASK, it will open the edit + delete menu
  function handleTaskClick(id) {
    const updatedTasks = myTasks.map((task) => {
      if (id == task.id) {
        return { ...task, active: !task.active };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  // {TODO 6}: Fix this function to be a UPDATE api
  // FUNCTION: when you click the "completion circle", it will mark a task as complete/incomplete

  // OLD FUNCTION
  // function handleOnClick(id) {
  //   const updatedTasks = myTasks.map((task) => {
  //     if (id == task.id) {
  //       return { ...task, status: !task.status };
  //     }
  //     return task;
  //   });
  //   setTasks(updatedTasks);
  // }

  // UPDATE API: NEW FUNCTION
  async function handleOnClick(id) {
    try {
      const task = myTasks.find((t) => t.id === id); // find the task
  
      const taskRef = doc(db, "tasks", id);
  
      await updateDoc(taskRef, {
        status: !task.status
      });
  
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  // FUNCTION: when you click the DELETE button for a task, it deletes the task

  // OLD FUNCTION
  // function handleDelete(id) {
  //   const remainingTasks = myTasks.filter((task) => id !== task.id);
  //   setTasks(remainingTasks);
  // }

  // DELETE API: NEW FUNCTION
  const handleDelete = async (id) => {
    try {
      const docRef = doc(db, "tasks", id);
      await deleteDoc(docRef);
      console.log("Document successfully deleted from Firestore");
    } catch (error) {
      console.error("Error removing document:", error);
    }
  };

  // FUNCTION: when you click the EDIT button for a task, it displays a text input area to edit text

  function handleEditClick(id) {
    const updatedTasks = myTasks.map((task) => {
      if (id === task.id) {
        return { ...task, editMode: !task.editMode };
      }
      return task;
    });
  
    setTasks(updatedTasks);
  }


  // FUNCTION: when you have the edit menu open and click the SUBMIT button, it will update your task
  
  // OLD FUNCTION
  // function handleEditSubmit(id, newTaskText) {
  //   const updatedTasks = myTasks.map((task) => {
  //     if (id == task.id) {
  //       return { ...task, task: newTaskText, editMode: !task.editMode };
  //     }
  //     console.log(newTaskText);
  //     return task;
  //   });
  //   setTasks(updatedTasks);
  // }

  // UPDATE API: NEW FUNCTION
  async function handleEditSubmit(id, newTaskText) {
    try {
      const taskRef = doc(db, "tasks", id);
  
      await updateDoc(taskRef, {
        task: newTaskText,
        editMode: false
      });
  
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }


  // ----------------------------- HTML CONTENT THAT YOU WILL RETURN ----------------------------
  return (
    <div className="flex flex-col gap-5 rounded-lg w-100 h-150 overflow-y-scroll items-center shadow-xl/30 p-10 bg-[#F487B6]">
      <h1 className="text-white font-bold text-2xl">💗 WiCS To-Do List</h1>

      {/* LIST VIEW OF TO-DOS */}
      <ul className="flex flex-col text-pink-700 gap-2 font-bold h-100 overflow-y-scroll">
        {myTasks.map((item) => (
          // we are iterating through all of our tasks in our array and creating a ListItem component for each one 
          // that's populated with the proper information and functions
          <ListItem
            key={item.id}
            id={item.id}
            task={item.task}
            status={item.status}
            active={item.active}
            editMode={item.editMode}
            handleOnClick={() => handleOnClick(item.id)}
            handleTaskClick={() => handleTaskClick(item.id)}
            handleDelete={() => handleDelete(item.id)}
            handleEditClick={() => handleEditClick(item.id)}
            handleEditSubmit={(id, newText) => handleEditSubmit(id, newText)}
          />
        ))}
      </ul>

        {/* ADD TO DO SECTION */}
      <div className="flex gap-5">
        <input
          type="text"
          className="rounded-md border-2 border-white bg-white p-0.5"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-pink-500 shadow-lg shadow-pink-500/50 text-white p-2 rounded-md active:relative active:top-0.5 cursor-pointer"
          onClick={postData}
        >
          Add To-Do
        </button>
      </div>
    </div>
  );
}
