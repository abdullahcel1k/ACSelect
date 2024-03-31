import "./App.css";
import Select from "./components/Select";
import { getCharecters } from "./core/services";

function App() {
  return (
    <>
      <Select optionsRequest={getCharecters} />
    </>
  );
}

export default App;
