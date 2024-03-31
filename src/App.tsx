import "./App.css";
import Select from "./components/Select";
import { getCharecters } from "./core/services";

function App() {
  const options = [
    {
      value: "1",
      label: "rick 1",
    },
    {
      value: "2",
      label: "morthy 1",
    },
    {
      value: "3",
      label: "rich black",
    },
    {
      value: "4",
      label: "rick white",
    },
    {
      value: "5",
      label: "rick yellow",
    },
    {
      value: "6",
      label: "morthy purple",
    },
    {
      value: "7",
      label: "morthy green",
    },
    {
      value: "8",
      label: "rick purple",
    },
  ];

  return (
    <>
      <Select optionsRequest={getCharecters} />
      {/* <Select options={options} /> */}
    </>
  );
}

export default App;
