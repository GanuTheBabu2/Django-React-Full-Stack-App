import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/api/user/${id}/`);
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load user profile", err);
      }
    };
    fetchUser();
  }, [id]);

  if (!user) return <p>Loading user profile...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>{user.username}</h2>
      <p>Email: {user.email}</p>
      <p>Rank: {user.rank}</p>
      <p>Footprint: {user.footprint}</p>
    </div>
  );
}
