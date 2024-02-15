import { useContext, useEffect, useRef } from "react";
import { FaFileUpload } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import FileContexts from "../contexts/FileContexts";

const CsvFileUploader = () => {
  const dropZone = useRef(null);
  const fileInput = useRef(null);
  const { uploadedFile, handleSetUploadedFile } = useContext(FileContexts);

  useEffect(() => {
    const drop = dropZone.current;

    drop.addEventListener("dragover", handleDragOver);
    drop.addEventListener("drop", handleDrop);

    return () => {
      drop.removeEventListener("dragover", handleDragOver);
      drop.removeEventListener("drop", handleDrop);
    };
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e);
  };

  const handleFiles = (event) => {
    const files = event.target.files || event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === "text/csv") {
        handleSetUploadedFile(file);
      } else {
        alert("Only .csv files are allowed!");
      }
    }
  };

  const openFileExplorer = () => {
    fileInput.current.click();
  };

  const removeFile = () => {
    handleSetUploadedFile(null);
    fileInput.current.value = "";
  };

  return (
    <div className="m-auto p-[40px] w-[80%] md:w-[70%] h-[400px] rounded-t-md shadow-md flex flex-col gap-5 justify-center items-center bg-white">
      <div
        ref={dropZone}
        className="w-full h-full flex flex-col justify-center items-center rounded-md border-[2px] border-dashed border-[#CCD9E5]"
      >
        <FaFileUpload className="w-[80px] h-auto mb-[30px]" color="#0496ff" />
        <p className="text-lg font-normal text-[#184B7F]">
          Drop your file here, or{" "}
          <button
            className="text-[#1E83FE] bg-transparent mb-2"
            onClick={openFileExplorer}
          >
            browse
          </button>
        </p>
        <p className="text-sm text-[#B7C6D7]">Supports: CSV</p>
        <input
          ref={fileInput}
          type="file"
          accept=".csv"
          className="w-full h-full hidden"
          onChange={handleFiles}
        />
      </div>

      {uploadedFile && (
        <div className="w-full flex justify-between items-center p-[10px] rounded-md border-[2px] border-dashed border-[#CCD9E5]">
          <div>
            <p className="text-lg text-[#184B7F]">Uploaded File</p>
            <p>{uploadedFile.name}</p>
          </div>

          <MdCancel
            className="w-[25px] h-auto cursor-pointer"
            onClick={removeFile}
          />
        </div>
      )}
    </div>
  );
};

export default CsvFileUploader;
