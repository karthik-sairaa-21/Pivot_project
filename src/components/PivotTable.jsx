// // src/components/PivotTable.jsx
// import React from "react";

// const PivotTable = ({ data, config }) => {
//   if (!data.length) return null;
//   const { row, col, val } = config;

//   if (!row.length || !col.length || !val.length) return <p>Please select rows, columns and values</p>;

//   const pivot = {};
//   const allColKeys = new Set();
//   const columnTotals = {};
//   let grandTotal = 0;

//   data.forEach((rowData) => {
//     const rowKey = row.map((f) => rowData[f] || "").join(" | ");
//     const colKey = col.map((f) => rowData[f] || "").join(" | ");

//     if (!pivot[rowKey]) pivot[rowKey] = {};
//     if (!pivot[rowKey][colKey]) pivot[rowKey][colKey] = {};

//     val.forEach(({ field }) => {
//       if (!pivot[rowKey][colKey][field]) pivot[rowKey][colKey][field] = [];
//       const value = parseFloat(rowData[field]) || 0;
//       pivot[rowKey][colKey][field].push(value);
//     });

//     allColKeys.add(colKey);
//   });

//   const rowKeys = Object.keys(pivot).sort();
//   const colKeys = Array.from(allColKeys).sort();

//   return (
//     <table>
//     <thead>
//   {/* First row: row headers + top-level column headers */}
//   <tr>
//     {row.map((field) => (
//       <th key={field} rowSpan={2}>{field}</th>
//     ))}
//     {
//       (() => {
//         // Group colKeys by first part (e.g., Product)
//         const colGroups = {};
//         colKeys.forEach(key => {
//           const [group, sub] = key.split(" | ");
//           if (!colGroups[group]) colGroups[group] = [];
//           colGroups[group].push(key);
//         });

//         return Object.entries(colGroups).map(([group, keys]) => (
//           <th key={group} colSpan={keys.length}>{group}</th>
//         ));
//       })()
//     }
//     <th rowSpan={2}>Total</th>
//   </tr>

//   {/* Second row: sub-level column headers */}
//   <tr>
//     {
//       colKeys.map(key => {
//         const parts = key.split(" | ");
//         return <th key={key}>{parts[1]}</th>; // Region
//       })
//     }
//   </tr>
// </thead>

//       <tbody>
//         {rowKeys.map((rowKey) => {
//           const rowParts = rowKey.split(" | ");
//           let rowTotal = 0;

//           return (
//             <tr key={rowKey}>
//               {rowParts.map((part, i) => (
//                 <td key={i}>{part}</td>
//               ))}
//               {[...Array(row.length - rowParts.length)].map((_, i) => (
//                 <td key={`pad-${i}`}></td>
//               ))}
//               {colKeys.map((col) => {
//                 const valueParts = val.map(({ field, aggregation }) => {
//                   const values = pivot[rowKey]?.[col]?.[field] || [];
//                   let result = 0;

//                   if (aggregation === "sum") result = values.reduce((a, b) => a + b, 0);
//                   else if (aggregation === "avg") result = values.reduce((a, b) => a + b, 0) / (values.length || 1);
//                   else if (aggregation === "max") result = values.length ? Math.max(...values) : 0;
//                   else if (aggregation === "min") result = values.length ? Math.min(...values) : 0;

//                   rowTotal += result;

//                   if (!columnTotals[col]) columnTotals[col] = {};
//                   columnTotals[col][field] = (columnTotals[col][field] || 0) + result;

//                   grandTotal += result;

//                   return result.toFixed(2);
//                 });

//                 return <td key={col}>{valueParts.join(", ")}</td>;
//               })}
//               <td><strong>{rowTotal.toFixed(2)}</strong></td>
//             </tr>
//           );
//         })}
//         <tr>
//           <th colSpan={row.length}>Total</th>
//           {colKeys.map((col) => {
//             const totalParts = val.map(({ field }) => {
//               const total = columnTotals[col]?.[field] || 0;
//               return total.toFixed(2);
//             });
//             return <th key={`total-${col}`}>{totalParts.join(", ")}</th>;
//           })}
//           <th>{grandTotal.toFixed(2)}</th>
//         </tr>
//       </tbody>

//     </table>
//   );
// };

// export default PivotTable;





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

  // Pivot data
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

  // Build header matrix from colKeys
  const headerMatrix = colKeys.map(key => key.split(" | "));
  const maxDepth = Math.max(...headerMatrix.map(parts => parts.length));

  // Pad short headers
  headerMatrix.forEach(parts => {
    while (parts.length < maxDepth) parts.push('');
  });

  // Generate colLevels with colSpan for each level
  const colLevels = [];
  for (let level = 0; level < maxDepth; level++) {
    const levelHeaders = [];
    let current = null;
    let span = 0;

    for (let i = 0; i < headerMatrix.length; i++) {
      const key = headerMatrix[i][level];
      if (key === current) {
        span++;
      } else {
        if (current !== null) {
          levelHeaders.push({ key: current, colSpan: span });
        }
        current = key;
        span = 1;
      }
    }
    if (current !== null) {
      levelHeaders.push({ key: current, colSpan: span });
    }
    colLevels.push(levelHeaders);
  }

  return (
    <table>
      <thead>
        {/* Row headers + first header row */}
        <tr>
          {row.map((field) => (
            <th key={field} rowSpan={colLevels.length}>{field}</th>
          ))}
          {colLevels[0].map(({ key, colSpan }, idx) => (
            <th key={key + idx} colSpan={colSpan}>{key}</th>
          ))}
          <th rowSpan={colLevels.length}>Total</th>
        </tr>

        {/* Render remaining header levels */}
        {colLevels.slice(1).map((level, levelIdx) => (
          <tr key={levelIdx + 1}>
            {level.map(({ key, colSpan }, idx) => (
              <th key={key + idx} colSpan={colSpan}>{key}</th>
            ))}
          </tr>
        ))}
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
              {colKeys.map((col) => {
                const valueParts = val.map(({ field, aggregation }) => {
                  const values = pivot[rowKey]?.[col]?.[field] || [];
                  let result = 0;

                  if (aggregation === "sum") result = values.reduce((a, b) => a + b, 0);
                  else if (aggregation === "avg") result = values.reduce((a, b) => a + b, 0) / (values.length || 1);
                  else if (aggregation === "max") result = values.length ? Math.max(...values) : 0;
                  else if (aggregation === "min") result = values.length ? Math.min(...values) : 0;

                  rowTotal += result;

                  if (!columnTotals[col]) columnTotals[col] = {};
                  columnTotals[col][field] = (columnTotals[col][field] || 0) + result;

                  grandTotal += result;

                  return result.toFixed(2);
                });

                return <td key={col}>{valueParts.join(", ")}</td>;
              })}
              <td><strong>{rowTotal.toFixed(2)}</strong></td>
            </tr>
          );
        })}
        <tr>
          <th colSpan={row.length}>Total</th>
          {colKeys.map((col) => {
            const totalParts = val.map(({ field }) => {
              const total = columnTotals[col]?.[field] || 0;
              return total.toFixed(2);
            });
            return <th key={`total-${col}`}>{totalParts.join(", ")}</th>;
          })}
          <th>{grandTotal.toFixed(2)}</th>
        </tr>
      </tbody>
    </table>
  );
};

export default PivotTable;
