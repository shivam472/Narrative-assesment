import "./App.css";
import CsvFileUploader from "./components/CsvFileUploader";
import CsvMapper from "./components/CsvMapper";

function App() {
  return (
    <div className="h-full w-full bg-[#E9F3FE] py-[40px]">
      <CsvFileUploader />
      <CsvMapper />
    </div>
  );
}

export default App;
