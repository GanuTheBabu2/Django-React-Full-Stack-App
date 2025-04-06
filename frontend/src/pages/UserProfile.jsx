import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hasReviewed, setHasReviewed] = useState(false);
  const [userId, setUserId] = useState(null); // logged-in user

  useEffect(() => {
    fetchUser();
    fetchReviews();
    fetchCurrentUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const res = await api.get(`/api/user/${id}/`);
      setUser(res.data);
    } catch (err) {
      console.error("Failed to load user profile", err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/api/user/${id}/reviews/`);
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to load reviews", err);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get("/api/current_user/");
      setUserId(res.data.id);

      const userReview = await api.get(`/api/user/${id}/reviews/`);
      const alreadyReviewed = userReview.data.some(
        (r) => r.reviewer === res.data.id
      );
      setHasReviewed(alreadyReviewed);
    } catch (err) {
      console.error("Failed to fetch current user", err);
    }
  };

  const handleSubmitReview = async () => {
    try {
      await api.post("/api/user/review/", {
        reviewed_user: id,
        rating,
        comment,
      });
      setComment("");
      setRating(0);
      fetchUser();
      fetchReviews();
      setHasReviewed(true);
    } catch (err) {
      console.error("Failed to submit review", err);
    }
  };

  const renderStars = (num) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <span key={i} style={{ color: i < num ? "gold" : "#ccc" }}>★</span>
      ));
  };

  if (!user) return <p>Loading user profile...</p>;

  return (
    <div style={{ padding: "2rem", maxWidth: 600, margin: "auto" }}>
      <div style={{ textAlign: "center" }}>
        <h2>{user.username}</h2>
        <p>Email: {user.email}</p>

        <div
  style={{
    margin: "1rem auto",
    width: 100,
    height: 100,
    borderRadius: "50%",
    background: "linear-gradient(to right, #4facfe, #00f2fe)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "1.5rem",
    fontWeight: "bold",
  }}
>
  {isNaN(Number(user.rank)) ? "0.0" : Number(user.rank).toFixed(1)}
</div>

        <p style={{ fontWeight: "bold" }}>User Rating</p>
        <p>Footprint: {user.footprint}</p>
      </div>

      <hr style={{ margin: "2rem 0" }} />

      {/* Review Form */}
      {!hasReviewed && userId !== parseInt(id) && (
        <div style={{ marginBottom: "2rem" }}>
          <h3>Leave a Review</h3>
          <div style={{ fontSize: "1.5rem" }}>
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <span
                  key={i}
                  onClick={() => setRating(i + 1)}
                  style={{
                    cursor: "pointer",
                    color: i < rating ? "gold" : "#ccc",
                  }}
                >
                  ★
                </span>
              ))}
          </div>
          <textarea
            rows={3}
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ width: "100%", marginTop: "1rem", padding: "0.5rem" }}
          />
          <button
            onClick={handleSubmitReview}
            style={{
              marginTop: "0.5rem",
              background: "#4facfe",
              color: "#fff",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Submit Review
          </button>
        </div>
      )}

      {/* Reviews Section */}
      <div>
        <h3>Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              style={{
                border: "1px solid #ddd",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1rem",
              }}
            >
              <p style={{ margin: 0, fontWeight: "bold" }}>
                {review.reviewer_username}
              </p>
              <div>{renderStars(review.rating)}</div>
              <p style={{ marginTop: "0.5rem" }}>{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
