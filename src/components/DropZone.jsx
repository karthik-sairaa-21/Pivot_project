import React from "react";

const DropZone = ({ title, type, fields, onDropField, onRemoveField, onChangeAggregation }) => {
  const allowDrop = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    const field = e.dataTransfer.getData("text");
    onDropField(type, field);
  };

  return (
    <div>
      <strong>{title}:</strong>
      <div className="drop-zone" onDrop={handleDrop} onDragOver={allowDrop}>
        {fields.map((fieldObj, index) => {
          const field = typeof fieldObj === "string" ? fieldObj : fieldObj.field;
          return (
            <div key={field} className="selected-field">
              {field}
              {type === "val" && (
                <select
                  value={fieldObj.aggregation}
                  onChange={(e) => onChangeAggregation(index, e.target.value)}
                >
                  {["sum", "avg", "max", "min"].map((agg) => (
                    <option key={agg} value={agg}>
                      {agg.toUpperCase()}
                    </option>
                  ))}
                </select>
              )}
              <button onClick={() => onRemoveField(type, index)}>×</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DropZone;
