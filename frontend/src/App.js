import React from "react";
import "./App.css"; // Importing CSS styles for the app
import ContactList from "./components/ContactList";
import ContactForm from "./components/ContactForm";
import ContactDropDown from "./components/ContactDropDown"; // Importing the ContactDropDown component
import Search from "./components/Search";

function App() {

  return (
    <div style={{ padding: "2rem" }}>
      <header>
        <h1>Contact Manager</h1>
      </header>
      <main>
        <section>
          <div style={{display: "flex", justifyContent: "space-between"}}>
            <h2>Contact List</h2>          
            <ContactDropDown Component={<ContactForm />} Message="Add Contact" />
          </div>
          <Search />
        </section>
      </main>
      <footer>
        <p>&copy; 2025 Flotschi</p>
      </footer>
    </div>
  );
}

export default App;
