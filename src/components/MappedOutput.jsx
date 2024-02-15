const MappedOutput = ({ tableData }) => {
  console.log("tableData", tableData);

  return (
    <div className="mt-4">
      <div className="flex justify-center mb-2">Results</div>
      <table className="w-full">
        <thead>
          <tr>
            {Object.keys(tableData[0] || {})
              .filter((key) => key !== "id")
              .map((header) => (
                <th key={header} className="text-left p-2 border">
                  {header}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              {Object.entries(row)
                .filter(([key]) => key !== "id")
                .map(([key, value], cellIndex) => (
                  <td key={cellIndex} className="p-2 border">
                    {value}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MappedOutput;
