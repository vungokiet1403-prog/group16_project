import axios from "axios";
import './App.css';
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000"});
export default function App() {
  const refresh = () => window.location.reload();
  return (
    <div style={{ padding: 24 }}>
      <h2>Group Project — Users</h2>
      <AddUser onAdded={refresh} />
      <UserList />
    </div>
  );
}


