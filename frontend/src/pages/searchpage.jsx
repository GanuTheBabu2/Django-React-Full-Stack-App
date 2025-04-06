// src/pages/searchpage.jsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MobileNavbar from "../components/MobileNavbar.jsx";
import api from "../api";
import styles from "../styles/searchpageStyles.js";

export default function SearchTabs() {
  const [activeTab, setActiveTab] = useState("user");
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  const tabs = [
    { key: "product", label: "Product" },
    { key: "request", label: "Request" },
    { key: "user", label: "User" },
  ];

  const tabPlaceholders = {
    user: "Search by username...",
    product: "Search by product name...",
    request: "Search by request name...",
  };

  const endpointMap = {
    user: "/api/users/",
    product: "/api/listings/",
    request: "/api/requests/",
  };

  const placeholder = tabPlaceholders[activeTab];

  const handleSearch = async () => {
    if (!searchValue.trim()) return;

    try {
      setLoading(true);
      const response = await api.get(endpointMap[activeTab], {
        params: { q: searchValue },
      });
      console.log("Search results:", response.data);
      setResults(response.data);
    } catch (error) {
      console.error(`Error fetching ${activeTab} search:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (item) => {
    const { id } = item;
    if (!id) {
      console.error("ID is undefined for navigation", item);
      return;
    }
    if (activeTab === "user") {
      navigate(`/user/${id}`);

    } else if (activeTab === "product") {
      navigate(`/listings/view/${id}`);
    } else if (activeTab === "request") {
      navigate(`/requests/view/${id}`);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.tabList}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setSearchValue("");
              setResults(null);
              inputRef.current?.focus();
            }}
            style={{
              ...styles.tabButton,
              ...(activeTab === tab.key ? styles.activeTab : {}),
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={styles.inputWrapper}>
        <input
          ref={inputRef}
          autoFocus
          type="text"
          name="searchInput"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSearch} style={styles.searchButton}>
          🔍
        </button>
      </div>
      {loading && <p style={styles.loadingText}>Searching...</p>}
      {results && (
        <div style={styles.resultsContainer}>
          {results.length === 0 ? (
            <p style={styles.noResults}>No results found.</p>
          ) : (
            results.map((item) => (
              <div key={item.id} style={styles.resultCard}>
                {activeTab === "user" && (
                  <>
                    <p style={styles.resultName}>{item.username}</p>
                    <p style={styles.resultEmail}>{item.email}</p>
                  </>
                )}
                {activeTab === "product" && (
                  <>
                    {item.image && (
                      <img
                        src={`${BASE_URL}${item.image}`}
                        alt={item.name}
                        style={styles.resultImage}
                      />
                    )}
                    <p style={styles.resultName}>{item.name}</p>
                    <p style={styles.resultEmail}>Cost: ₹{item.cost}</p>
                  </>
                )}
                {activeTab === "request" && (
                  <>
                    <p style={styles.resultName}>{item.request_name}</p>
                    <p style={styles.resultEmail}>
                      Max Price: ₹{item.max_price}
                    </p>
                  </>
                )}
                <button
                  onClick={() => handleViewDetails(item)}
                  style={styles.viewButton}
                >
                  View Details
                </button>
              </div>
            ))
          )}
        </div>
      )}
      <div style={{ height: "4rem" }} /> {/* <-- This ensures bottom gap */}
      <MobileNavbar />
    </div>
  );
}
