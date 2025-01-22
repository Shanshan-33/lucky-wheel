import React, { useState } from "react";
import Header from "./components/Header";
import Question from "./components/Question";
import Participants from "./components/Participants";
import "./App.css";
import Wheel from "./components/Wheel";

export const MAX_PARTICIPANTS = 18;

function App() {
  const [names, setNames] = useState([]);
  const handleAddName = (name) => {
    if (names.length < MAX_PARTICIPANTS) {
      setNames([...names, name]);
    }
  };

  const handleRemoveName = (index) => {
    setNames(names.filter((_, i) => i !== index));
  };

  const shuffleNames = () => {
    const shuffledNames = [...names].sort(() => Math.random() - 0.5);
    setNames(shuffledNames);
  };

  const sortNames = () => {
    const sortedNames = [...names].sort((a, b) => a.localeCompare(b));
    setNames(sortedNames);
  };
  return (
    <div>
      <Header />
      <Question />
      <div className="whell-wrapper">
        <Participants
          handleAddName={handleAddName}
          handleRemoveName={handleRemoveName}
          shuffleNames={shuffleNames}
          sortNames={sortNames}
          names={names}
        />
        <Wheel participants={names} />
      </div>
    </div>
  );
}

export default App;
