// src/App.jsx
import React, { useState } from "react";
import CSVUploader from "./CSVUploader";
import FieldSelector from "./FieldSelector";
import DropZone from "./DropZone";
import PivotTable from "./PivotTable";
// import "./App.css";

const App = () => {
  const [parsedData, setParsedData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [selectedFields, setSelectedFields] = useState({ row: [], col: [], val: [] });

  const onDropField = (type, field) => {
    if (selectedFields.row.includes(field) || selectedFields.col.includes(field) || selectedFields.val.some(f => f.field === field)) return;

    const updated = { ...selectedFields };
    if (type === "val") updated.val.push({ field, aggregation: "sum" });
    else updated[type].push(field);
    setSelectedFields(updated);
  };

  const onRemoveField = (type, index) => {
    const updated = { ...selectedFields };
    updated[type].splice(index, 1);
    setSelectedFields(updated);
  };

  const onChangeAggregation = (index, aggregation) => {
    const updated = { ...selectedFields };
    updated.val[index].aggregation = aggregation;
    setSelectedFields(updated);
  };

  return (
    <div className="container">
      <h2 className="">Pivot Table</h2>
      <CSVUploader setParsedData={setParsedData} setHeaders={setHeaders} />
      <h3 className="file-upload-container label">CSV Data Preview</h3>
      <div className="preview-table">
        {parsedData.length > 0 && (
          <table>
            <thead>
              <tr>
                {headers.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {parsedData.map((row, i) => (
                <tr key={i}>
                  {headers.map((h) => (
                    <td key={h}>{row[h]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <h3>Fields</h3>
      <FieldSelector headers={headers} />

      <h3>Drop Zones</h3>
      <DropZone
        title="Rows"
        type="row"
        fields={selectedFields.row}
        onDropField={onDropField}
        onRemoveField={onRemoveField}
      />
      <DropZone
        title="Columns"
        type="col"
        fields={selectedFields.col}
        onDropField={onDropField}
        onRemoveField={onRemoveField}
      />
      <DropZone
        title="Values"
        type="val"
        fields={selectedFields.val}
        onDropField={onDropField}
        onRemoveField={onRemoveField}
        onChangeAggregation={onChangeAggregation}
      />

      <h3>Pivot Table</h3>
      <PivotTable data={parsedData} config={selectedFields} />
    </div>
  );
};

export default App;
