const MappedOutput = ({ tableData }) => {
  return (
    <div className="mt-10">
      <div className="flex justify-center mb-2 text-[#184B7F] text-lg font-medium">
        Results
      </div>
      <div className="flex justify-center overflow-x-auto">
        <table className="min-w-[600px]">
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
    </div>
  );
};

export default MappedOutput;
