import React from "react";

const FieldSelector = ({ headers }) => {
  return (
    <div id="fieldContainer">
      {headers.map((field) => (
        <div
          key={field}
          className="field"
          draggable
          onDragStart={(e) => e.dataTransfer.setData("text", field)}
        >
          {field}
        </div>
      ))}
    </div>
  );
};export default FieldSelector;