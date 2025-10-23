import { useEffect, useState } from "react";
import axios from "axios";

export default function UserList() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const { data } = await axios.get("http://localhost:3000/users");
    setUsers(data);
  };

  useEffect(() => { fetchUsers(); }, []);

  return (
    <div>
      <h3>Users</h3>
      <ul>
        {users.map((u, i) => (
          <li key={u._id || u.id || i}>{u.name} — {u.email}</li>
        ))}
      </ul>
    </div>
  );
}
