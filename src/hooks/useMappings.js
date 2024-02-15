import { useCallback, useState } from "react";

const useMappings = (tableColumns) => {
  const [mappings, setMappings] = useState(() =>
    tableColumns.reduce(
      (acc, col) => ({
        ...acc,
        [col]: { headers: [], action: null },
      }),
      {}
    )
  );

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

  const getAllSelectedHeadersExceptCurrent = useCallback(
    (currentColumn) => {
      return Object.entries(mappings).reduce((acc, [col, { headers }]) => {
        if (col !== currentColumn) acc.push(...headers);
        return acc;
      }, []);
    },
    [mappings]
  );

  return { mappings, updateMapping, getAllSelectedHeadersExceptCurrent };
};

export default useMappings;
