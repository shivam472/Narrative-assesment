import { useEffect, useState } from "react";

const useCsvFileReader = (uploadedFile) => {
  const [csvData, setCsvData] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);

  useEffect(() => {
    if (!uploadedFile) return;

    const readFile = () => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const data = parseCSV(text);
        setCsvData(data);
      };
      reader.readAsText(uploadedFile);
    };

    readFile();
  }, [uploadedFile]);

  const parseCSV = (text) => {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);
    const headers = lines.shift().split(",");
    setCsvHeaders(headers);

    return lines.map((line) => {
      const values = line.split(",");
      return headers.reduce((object, header, index) => {
        object[header] = values[index];
        return object;
      }, {});
    });
  };

  return { csvHeaders, csvData };
};

export default useCsvFileReader;
