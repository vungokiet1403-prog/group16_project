import { useEffect, useState } from "react";
import { api } from "../api";

export default function UserList({ refreshRef }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");
      setUsers(res.data || []);
    } catch (err) {
      alert(err?.response?.data?.message || "Lỗi tải danh sách user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    if (refreshRef) refreshRef.current = fetchUsers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading && users.length === 0) return <p>Đang tải...</p>;

  return (
    <ul style={{ paddingLeft: 16 }}>
      {users.map(u => <li key={u._id || u.id}><b>{u.name}</b> — {u.email}</li>)}
      {users.length === 0 && <li>Chưa có user</li>}
    </ul>
  );
}
