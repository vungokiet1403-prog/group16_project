import AddUser from "./components/AddUser";
import UserList from "./components/UserList";

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
