import { useCallback, useState } from "react";
import { getColumnNames } from "../db";

const useMappings = () => {
  const tableColumns = getColumnNames();

  const initialMappings = tableColumns.reduce(
    (acc, col) => ({
      ...acc,
      [col]: { headers: [], action: null },
    }),
    {}
  );
  const [mappings, setMappings] = useState(initialMappings);

  const updateMapping = useCallback(
    (column, selectedOptions, action = null) => {
      setMappings((prevMappings) => ({
        ...prevMappings,
        [column]: {
          headers: selectedOptions.map((option) =>
            typeof option === "string" ? option : option.value
          ),
          action,
        },
      }));
    },
    []
  );

  const resetMapping = () => {
    setMappings(initialMappings);
  };

  const getAllSelectedHeadersExceptCurrent = useCallback(
    (currentColumn) => {
      return Object.entries(mappings).reduce((acc, [col, { headers }]) => {
        if (col !== currentColumn) acc.push(...headers);
        return acc;
      }, []);
    },
    [mappings]
  );

  return {
    tableColumns,
    mappings,
    updateMapping,
    resetMapping,
    getAllSelectedHeadersExceptCurrent,
  };
};

export default useMappings;
