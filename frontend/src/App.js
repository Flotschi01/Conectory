import React from "react";
import ContactList from "./components/ContactList";
import ContactForm from "./components/ContactForm";

function App() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Contact Manager</h1>
      <ContactForm />
      <hr />
      <ContactList />
    </div>
  );
}

export default App;
