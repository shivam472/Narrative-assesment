import { useContext, useState } from "react";
import FileContexts from "../contexts/FileContexts";
import { fetchDataFromDb, getColumnNames, saveToDb } from "../db";
import { GoArrowBoth } from "react-icons/go";
import ReactSelect from "react-select";
import MappedOutput from "./MappedOutput";
import useCsvFileReader from "../hooks/useCsvFileReader";
import useMappings from "../hooks/useMappings";

const CsvMapper = () => {
  const { uploadedFile } = useContext(FileContexts);
  const { csvData, csvHeaders } = useCsvFileReader(uploadedFile);
  const [isMappingSavedToDb, setIsMappingSavedToDb] = useState(false);
  const tableColumns = getColumnNames();
  const { mappings, updateMapping, getAllSelectedHeadersExceptCurrent } =
    useMappings(tableColumns);
  const [mappedTableData, setMappedTableData] = useState([]);

  console.log("tableColumns", tableColumns);

  console.log("mapping: ", mappings);

  const generateResult = async () => {
    setMappedTableData([]);
    const transformedData = csvData.map((row) => {
      const resultRow = {};
      Object.entries(mappings).forEach(([column, { headers, action }]) => {
        if (action === "concatenate") {
          resultRow[column] = headers.map((header) => row[header]).join(" ");
        } else if (action === "split") {
          // Implement splitting logic if needed
        } else if (headers.length === 1) {
          resultRow[column] = row[headers[0]];
        }
      });
      return resultRow;
    });

    await saveToDb(transformedData);
    const mappedTableData = await fetchDataFromDb();
    setMappedTableData(mappedTableData);
  };

  return (
    <div className="m-auto p-[40px] w-[80%] md:w-[70%] min-h-[400px] bg-white rounded-b-md shadow-md">
      <div className="flex justify-center">Map CSV data to Database</div>
      {uploadedFile ? (
        <div className="flex flex-col w-full">
          <div className="flex justify-between w-full mb-3">
            <p>Database Columns</p>
            <p>CSV Headers</p>
          </div>
          <div className="w-full flex flex-col gap-3">
            {tableColumns.map((col) => {
              const selectedHeaders = getAllSelectedHeadersExceptCurrent(col);
              return (
                <div className="flex items-center" key={col}>
                  <div className="w-[40%] p-2 bg-white border-[1px] border-[#bfbfbf] rounded-md">
                    {col}
                  </div>

                  <GoArrowBoth className="mx-2" />

                  <div className="flex items-center gap-2 w-[60%]">
                    <ReactSelect
                      isMulti
                      options={csvHeaders.map((header) => ({
                        label: header,
                        value: header,
                        isDisabled: selectedHeaders.includes(header),
                      }))}
                      value={mappings[col].headers.map((header) => ({
                        label: header,
                        value: header,
                      }))}
                      onChange={(selectedOptions) =>
                        updateMapping(col, selectedOptions)
                      }
                      menuPlacement="auto"
                      styles={{
                        container: (baseStyles) => ({
                          ...baseStyles,
                          width: "100%",
                        }),
                      }}
                    />

                    {mappings[col].headers.length > 1 && (
                      <ReactSelect
                        placeholder="Select Action"
                        onChange={(selectedOption) =>
                          updateMapping(
                            col,
                            mappings[col].headers,
                            selectedOption.value
                          )
                        }
                        options={[
                          { label: "Split", value: "split" },
                          { label: "Concatenate", value: "concatenate" },
                        ]}
                        styles={{
                          container: (baseStyles) => ({
                            ...baseStyles,
                            width: "50%",
                          }),
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex w-full justify-center mt-7">
            <button
              onClick={generateResult}
              className="bg-[#3255fb] hover:bg-[#0496ff] text-white w-fit rounded-[5px] py-2 px-3"
            >
              Generate Result
            </button>
          </div>

          {mappedTableData.length > 0 && (
            <MappedOutput tableData={mappedTableData} />
          )}
        </div>
      ) : (
        <div>Please Upload a file first</div>
      )}
    </div>
  );
};

export default CsvMapper;
