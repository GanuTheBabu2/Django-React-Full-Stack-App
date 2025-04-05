import { useState, useEffect, useRef } from "react";
import api from "../api";
import Chart from "chart.js/auto";
import "../styles/Home.css";
import MobileNavbar from "../components/MobileNavbar.jsx";

function Home() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState([]);
  const [activeTab, setActiveTab] = useState("listings");
  const [listings, setListings] = useState([]);
  const [requests, setRequests] = useState([]);
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Fetch profile
    api
      .get("/api/user/profile/")
      .then((res) => setUser(res.data))
      .catch((err) => alert(err));

    // Fetch listing/request stats (grouped by month)
    api
      .get("/api/user/stats/?period=month") // you might need to adjust this endpoint
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => alert(err));

    // Fetch user's listings and requests
    api
      .get("/api/listings/")
      .then((res) => {
        const sorted = res.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setListings(sorted);
      })
      .catch((err) => console.error("Listings fetch error:", err));

    api
      .get("/api/requests/")
      .then((res) => {
        const sorted = res.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setRequests(sorted);
      })
      .catch((err) => console.error("Requests fetch error:", err));
  }, []);

  // Render Chart
  useEffect(() => {
    if (!stats || stats.length === 0 || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");

    // Destroy previous chart
    if (chartRef.current) chartRef.current.destroy();

    // Extract months
    const labels = stats.map((s) => s.month);

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Listings",
            data: stats.map((s) => s.listings),
            borderColor: "#3b82f6",
            backgroundColor: "#3b82f6",
            fill: false,
            tension: 0.3,
          },
          {
            label: "Requests",
            data: stats.map((s) => s.requests),
            borderColor: "#f97316",
            backgroundColor: "#f97316",
            fill: false,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            precision: 0,
          },
        },
      },
    });
  }, [stats]);

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Hello, {user ? user.username : "Guest"}!</h1>

        <h2>Activity Summary</h2>
        <div className="summary-stats">
          <p>
            <strong>Total Listings:</strong> {listings.length}
          </p>
          <p>
            <strong>Total Requests:</strong> {requests.length}
          </p>
          <p>
            <strong>Most Recent Listing:</strong>{" "}
            {listings[0]
              ? new Date(listings[0].created_at).toLocaleString()
              : "N/A"}
          </p>
          <p>
            <strong>Most Recent Request:</strong>{" "}
            {requests[0]
              ? new Date(requests[0].created_at).toLocaleString()
              : "N/A"}
          </p>
        </div>

        <div style={{ marginTop: "30px" }}>
          <h2>History</h2>
          <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
            <button
              onClick={() => setActiveTab("listings")}
              className={activeTab === "listings" ? "tab-active" : "tab"}
            >
              Listings
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={activeTab === "requests" ? "tab-active" : "tab"}
            >
              Requests
            </button>
          </div>

          {activeTab === "listings" &&
            listings.map((item) => (
              <div key={item.id} className="history-card">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p>
                  <strong>Created:</strong>{" "}
                  {item.created_at
                    ? new Date(item.created_at).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            ))}

          {activeTab === "requests" &&
            requests.map((item) => (
              <div key={item.id} className="history-card">
                <h3>{item.request_name}</h3>
                <p>{item.description}</p>
                <p>
                  <strong>Created:</strong>{" "}
                  {item.created_at
                    ? new Date(item.created_at).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            ))}
        </div>
      </div>
      <MobileNavbar />
    </div>
  );
}

export default Home;
