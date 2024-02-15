import { createContext, useState } from "react";

const FileContexts = createContext();

export const FileContextProvider = ({ children }) => {
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleSetUploadedFile = (file) => {
    setUploadedFile(file);
  };

  const contextObj = {
    uploadedFile,
    handleSetUploadedFile,
  };

  return (
    <FileContexts.Provider value={contextObj}>{children}</FileContexts.Provider>
  );
};

export default FileContexts;
