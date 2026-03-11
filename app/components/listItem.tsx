import { useState } from "react";

export interface item {
  id: string; // each list item needs a unique id
  task: string;
  status: boolean; // complete or incomplete
  active: boolean; // did someone click on this container? if so, show the edit + delete buttons
  editMode: boolean;
  handleOnClick: (id: string) => void;
  handleTaskClick: (id: string) => void;
  handleDelete: (id: string) => void;
  handleEditClick: (id: string) => void;
  handleEditSubmit: (id: string, task: string) => void;
}

// This is our To-Do List Item component. It has several different pieces of information
// -  A unique ID
// - The actual task
// - Status of the task (incomplete/complete)
// - Active (to show delete/edit menu)
// - Edit (are we updating the text?)
// - Functions passed in through parent to update the item and parent list view

export default function listItem({ id, task, status,active,editMode,handleOnClick,handleTaskClick,handleDelete,handleEditClick,handleEditSubmit,}: item) {
  const [input, setInput] = useState(task);

  return (
    <div
      onClick={(e) => { handleTaskClick(id);}}
      className={`${active ? "border-amber-300" : ""} bg-white rounded-sm shadow-md/30 flex flex-col  p-5 w-80 cursor-pointer gap-3`}>
      <div className="flex flex-row gap-5">

        {/* COMPLETION BUTTON */}
        <button
          onClick={(e) => { e.stopPropagation(); handleOnClick(id);}}
          type="button"
          className={`${status ? "bg-yellow-200" : "bg-white"} cursor-pointer inset-shadow-md/30 border border-gray-300 min-w-5 max-w-5 min-h-5 max-h-5 rounded-3xl`}/>
        {/* TASK */}
        <p className={`${status ? "line-through" : ""}`}>{task}</p>

      </div>

      {/* SHOW DELETE AND EDIT BUTTONS */}
      {active && (
        <div className="flex justify-end gap-5 ">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(id); // call the parent handle delete function
            }}
            className="text-red-500 bg-red-100 p-1 rounded-sm cursor-pointer"
          >
            Delete
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(id); // this will display edit mode below
            }}
            className="text-blue-400 bg-blue-100 p-1  rounded-sm cursor-pointer"
          >
            Edit
          </button>
        </div>
      )}

      {/* CLICK EDIT BUTTON --> EDIT MODE */}
      {editMode && (
        <>
          <input
            value={input}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              setInput(e.target.value);
              console.log(input);
            }}
            type="text"
            className="rounded-md border-2 border-pink-400 bg-white p-0.5"
          />

          {/* EDIT SUBMIT BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditSubmit(id, input);
            }}
            className="text-blue-400 bg-blue-100 p-1  rounded-sm cursor-pointer"
          >
            Submit
          </button>
        </>
      )}
    </div>
  );
}
