import React, { useEffect, useState } from "react";
import { Users } from "./api";

export default function App() {
  const [users, setUsers] = useState([]);
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    Users.list()
      .then(res => setUsers(res.data))
      .catch(e => setErr(e?.response?.data?.message || e.message))
      .finally(() => setLoading(false));
  }, []);

  const addUser = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Users.add({ name, email });
      setUsers(prev => [data, ...prev]);
      setName(""); setEmail("");
      setErr("");
    } catch (e) {
      setErr(e?.response?.data?.message || e.message);
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Users</h1>

      <form onSubmit={addUser} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input placeholder="Name"  value={name}  onChange={e => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <button type="submit">Add</button>
      </form>

      {loading && <p>Loading...</p>}
      {err && <p style={{ color: "red" }}>{err}</p>}

      <ul>
        {users.map(u => (
          <li key={u._id || u.id}>{u.name} — {u.email}</li>
        ))}
      </ul>
    </div>
  );
}
