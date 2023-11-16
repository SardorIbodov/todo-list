import React, { useState, useReducer } from "react";
import "./style.css";

const todos = [
  { id: 1, work: "Wake up", status: false, isEdited: false },
  { id: 2, work: "Have a breakfast", status: false, isEdited: false },
  { id: 3, work: "Go to school", status: false, isEdited: false },
  { id: 4, work: "Have a lunch", status: false, isEdited: false },
  { id: 5, work: "Play something", status: false, isEdited: false },
];

function* idGenerator() {
  let id = todos.length;
  while (true) {
    yield ++id;
  }
}
let newId = idGenerator();

export const UseReducer = () => {
  //! Todo app
  const [inputValue, setInputValue] = useState("");
  const [editedInput, setEditedInput] = useState("");

  const reducer = (state, action) => {
    switch (action.type) {
      case "check": {
        return state.map((value) => {
          return value.id === action.payload
            ? { ...value, status: !value.status }
            : value;
        });
      }
      case "delete": {
        return state.filter((value) => value.id !== action.payload);
      }
      case "add": {
        if (inputValue.trim().length > 0) {
          let inpValue = inputValue;
          setInputValue("");
          return [
            ...state,
            {
              id: newId.next().value,
              work: inpValue,
              status: false,
              isEdited: false,
            },
          ];
        } else return state;
      }
      case "edit": {
        return state.map((value) => {
          if (value.id === action.payload) {
            setEditedInput(value.work);
            return { ...value, isEdited: !value.isEdited };
          } else return value;
        });
      }
      case "save": {
        return state.map((value) => {
          return value.id === action.payload
            ? { ...value, work: editedInput, isEdited: false }
            : value;
        });
      }
      default:
        return state;
    }
  };

  const [data, dispatch] = useReducer(reducer, todos);

  return (
    <div>
      {/* Todo app  */}
      <div className="add">
        <input
          type="text"
          placeholder="Add new"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={() => dispatch({ type: "add" })}>Add</button>
      </div>

      <table border={1}>
        <tbody>
          {data.map((value) => {
            return (
              <tr key={value.id}>
                {Object.values(value).map((item, index) => {
                  return typeof item === "boolean" ? null : index === 1 ? (
                    value.isEdited ? (
                      <td key={index}>
                        <input
                          defaultValue={item}
                          onChange={(e) => setEditedInput(e.target.value)}
                        />
                      </td>
                    ) : (
                      <td
                        key={index}
                        style={{
                          textDecoration: value.status
                            ? "line-through"
                            : "none",
                          color: value.status ? "#ccc" : "#000",
                        }}
                      >
                        {item}
                      </td>
                    )
                  ) : (
                    <td key={index}>{item}</td>
                  );
                })}
                <td>
                  <button
                    onClick={() =>
                      dispatch({ type: "check", payload: value.id })
                    }
                  >
                    {value.status ? "Uncheck" : "Check"}
                  </button>
                </td>
                <td>
                  <button
                    onClick={() =>
                      dispatch({ type: "delete", payload: value.id })
                    }
                  >
                    Delete
                  </button>
                </td>
                <td>
                  {value.isEdited ? (
                    <span>
                      <button
                        onClick={() =>
                          dispatch({ type: "save", payload: value.id })
                        }
                      >
                        Save
                      </button>
                      <button
                        onClick={() =>
                          dispatch({ type: "edit", payload: value.id })
                        }
                      >
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={() =>
                        dispatch({ type: "edit", payload: value.id })
                      }
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UseReducer;
