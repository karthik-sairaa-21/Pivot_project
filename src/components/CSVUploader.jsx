// src/components/CSVUploader.jsx
import React from "react";
import Papa from "papaparse";

const CSVUploader = ({ setParsedData, setHeaders }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setParsedData(results.data);
        const headers = Object.keys(results.data[0] || {}).sort();
        setHeaders(headers);
      },
    });
  };

  return <input type="file" accept=".csv" onChange={handleFileChange} />;
};

export default CSVUploader;