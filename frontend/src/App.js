import React from "react";
import "./App.css"; // Importing CSS styles for the app
import TableList from "./components/ContactList";
import ContactForm from "./components/ContactForm";
import ContactDropDown from "./components/ContactDropDown"; // Importing the ContactDropDown component
import Search from "./components/Search";
import { Wrapper } from "./components/Wrapper"; // Importing the useRefresh custom hook
function App() {

  return (
    <div style={{ padding: "2rem" }}>
      <header>
        <h1>Contact Manager</h1>
      </header>
      <main>
        <Wrapper table_name={"contacts"}>
        </Wrapper>
        <Wrapper table_name={"relations"}>
        </Wrapper>
      </main>
      <footer>
        <p>&copy; 2025 Flotschi</p>
      </footer>
    </div>
  );
}

export default App;
