import { useContext, useEffect, useState } from "react";
import FileContexts from "../contexts/FileContexts";
import { fetchDataFromDb, saveToDb } from "../db";
import { GoArrowBoth } from "react-icons/go";
import ReactSelect from "react-select";
import MappedOutput from "./MappedOutput";
import useCsvFileReader from "../hooks/useCsvFileReader";
import useMappings from "../hooks/useMappings";

// constants
const ACTIONS = {
  CONCAT: "concat",
  SPLIT: "split",
};

const CsvMapper = () => {
  const { uploadedFile } = useContext(FileContexts);
  const { csvData, csvHeaders } = useCsvFileReader(uploadedFile);
  const {
    tableColumns,
    mappings,
    updateMapping,
    resetMapping,
    getAllSelectedHeadersExceptCurrent,
  } = useMappings();
  const [mappedTableData, setMappedTableData] = useState([]);

  useEffect(() => {
    if (!uploadedFile) {
      resetMapping();
      setMappedTableData([]);
    }
  }, [uploadedFile]);

  const generateResult = async () => {
    setMappedTableData([]);
    let transformedData = [];

    csvData.forEach((row) => {
      const resultRow = {};

      // first handle all the non-split actions
      Object.entries(mappings).forEach(([column, { headers, action }]) => {
        if (action === ACTIONS.CONCAT) {
          resultRow[column] = headers.map((header) => row[header]).join(" ");
        } else if (headers.length === 1) {
          resultRow[column] = row[headers[0]];
        }
      });

      let hasSplitAction = false;

      // then handle split actions separately by creating multiple rows
      Object.entries(mappings).forEach(([column, { headers, action }]) => {
        if (action === ACTIONS.SPLIT) {
          hasSplitAction = true;
          headers.forEach((header) => {
            const splitRow = { ...resultRow, [column]: row[header] };

            transformedData.push(splitRow);
          });
        }
      });

      if (!hasSplitAction) {
        transformedData.push(resultRow);
      }
    });

    await saveToDb(transformedData);
    const mappedTableData = await fetchDataFromDb();
    setMappedTableData(mappedTableData);
  };

  return (
    <div className="m-auto p-[40px] w-[80%] md:w-[70%] min-h-[400px] bg-white rounded-b-md shadow-md">
      <div className="flex justify-center text-[#184B7F] text-lg">
        Map CSV data to Database
      </div>

      <div className="flex flex-col w-full">
        <div className="flex justify-between w-full mb-3">
          <p className="text-[#184B7F]">Database Columns</p>
          <p className="text-[#184B7F]">CSV Headers</p>
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

                {uploadedFile && (
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
                          { label: "Split", value: ACTIONS.SPLIT },
                          { label: "Concatenate", value: ACTIONS.CONCAT },
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
                )}
              </div>
            );
          })}
        </div>

        <div className="flex w-full justify-center mt-7">
          <button
            onClick={generateResult}
            className="bg-[#3255fb] hover:bg-[#0496ff] text-white w-fit rounded-[5px] py-2 px-3 disabled:bg-[#F3F4F7] disabled:text-[#bfbfbf] disabled:cursor-not-allowed"
            disabled={!uploadedFile}
          >
            Generate Result
          </button>
        </div>

        {uploadedFile && mappedTableData.length > 0 && (
          <MappedOutput tableData={mappedTableData} />
        )}
      </div>
    </div>
  );
};

export default CsvMapper;
