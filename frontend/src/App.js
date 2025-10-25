import { useState } from "react";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";

export default function App() {
  const [bump, setBump] = useState(0);
  return (
    <div style={{ padding:20, fontFamily:"sans-serif" }}>
      <h1>Frontend ↔ MongoDB (Users)</h1>
      <AddUser onAdded={() => setBump(x=>x+1)} />
      <div key={bump} style={{ marginTop:20 }}>
        <UserList />
      </div>
    </div>
  );
}