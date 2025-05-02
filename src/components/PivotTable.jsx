// src/components/PivotTable.jsx
import React from "react";

const PivotTable = ({ data, config }) => {
  if (!data.length) return null;
  const { row, col, val } = config;

  if (!row.length || !col.length || !val.length) return <p>Please select rows, columns and values</p>;

  const pivot = {};
  const allColKeys = new Set();
  const columnTotals = {};
  let grandTotal = 0;

  data.forEach((rowData) => {
    const rowKey = row.map((f) => rowData[f] || "").join(" | ");
    const colKey = col.map((f) => rowData[f] || "").join(" | ");

    if (!pivot[rowKey]) pivot[rowKey] = {};
    if (!pivot[rowKey][colKey]) pivot[rowKey][colKey] = {};

    val.forEach(({ field }) => {
      if (!pivot[rowKey][colKey][field]) pivot[rowKey][colKey][field] = [];
      const value = parseFloat(rowData[field]) || 0;
      pivot[rowKey][colKey][field].push(value);
    });

    allColKeys.add(colKey);
  });

  const rowKeys = Object.keys(pivot).sort();
  const colKeys = Array.from(allColKeys).sort();

  return (
    <table>
      <thead>
        <tr>
          {row.map((field) => (
            <th key={field}>{field}</th>
          ))}
          {colKeys.map((col) =>
            val.map(({ field }) => <th key={`${col}-${field}`}>{`${col} | ${field}`}</th>)
          )}
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {rowKeys.map((rowKey) => {
          const rowParts = rowKey.split(" | ");
          let rowTotal = 0;

          return (
            <tr key={rowKey}>
              {rowParts.map((part, i) => (
                <td key={i}>{part}</td>
              ))}
              {[...Array(row.length - rowParts.length)].map((_, i) => (
                <td key={`pad-${i}`}></td>
              ))}
              {colKeys.map((col) =>
                val.map(({ field, aggregation }) => {
                  const values = pivot[rowKey]?.[col]?.[field] || [];
                  let aggregated = 0;

                  if (aggregation === "sum") aggregated = values.reduce((a, b) => a + b, 0);
                  else if (aggregation === "avg") aggregated = values.reduce((a, b) => a + b, 0) / (values.length || 1);
                  else if (aggregation === "max") aggregated = values.length ? Math.max(...values) : 0;
                  else if (aggregation === "min") aggregated = values.length ? Math.min(...values) : 0;

                  rowTotal += aggregated;

                  if (!columnTotals[col]) columnTotals[col] = {};
                  columnTotals[col][field] = (columnTotals[col][field] || 0) + aggregated;

                  grandTotal += aggregated;

                  return <td key={`${col}-${field}`}>{aggregated.toFixed(2)}</td>;
                })
              )}
              <td><strong>{rowTotal.toFixed(2)}</strong></td>
            </tr>
          );
        })}
        <tr>
          <th colSpan={row.length}>Total</th>
          {colKeys.map((col) =>
            val.map(({ field }) => {
              const total = columnTotals[col]?.[field] || 0;
              return <th key={`total-${col}-${field}`}>{total.toFixed(2)}</th>;
            })
          )}
          <th>{grandTotal.toFixed(2)}</th>
        </tr>
      </tbody>
    </table>
  );
};

export default PivotTable;
