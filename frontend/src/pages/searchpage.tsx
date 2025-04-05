import { useState, useRef } from "react";

type User = {
  id: number;
  username: string;
  email: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
};

type Request = {
  id: number;
  title: string;
  status: string;
};

export default function SearchTabs() {
  const [activeTab, setActiveTab] = useState<"user" | "product" | "request">("user");
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState<User[] | Product[] | Request[] | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const tabs = [
    { key: "user", label: "User" },
    { key: "product", label: "Product" },
    { key: "request", label: "Request" },
  ];

  const tabPlaceholders: Record<"user" | "product" | "request", string> = {
    user: "Search by user...",
    product: "Search by product...",
    request: "Search by request...",
  };

  const placeholder = tabPlaceholders[activeTab];

  const handleSearch = async () => {
    if (!searchValue.trim()) return;

    const endpointMap: Record<"user" | "product" | "request", string> = {
      user: "user",
      product: "product",
      request: "request",
    };

    const API_URL = import.meta.env.VITE_API_URL;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}api/search/${endpointMap[activeTab]}/?q=${searchValue}`);
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error(`Error fetching ${activeTab} search:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Tabs */}
      <div style={styles.tabList}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key as "user" | "product" | "request");
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

      {/* Search Input */}
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

      {/* Loading */}
      {loading && <p style={styles.loadingText}>Searching...</p>}

      {/* Results */}
      {results && (
        <div style={styles.resultsContainer}>
          {results.length === 0 ? (
            <p style={styles.noResults}>No results found.</p>
          ) : (
            results.map((item: any) => (
              <div key={item.id} style={styles.resultCard}>
                {activeTab === "user" && (
                  <>
                    <p style={styles.resultName}>{item.username}</p>
                    <p style={styles.resultEmail}>{item.email}</p>
                  </>
                )}
                {activeTab === "product" && (
                  <>
                    <p style={styles.resultName}>{item.name}</p>
                    <p style={styles.resultEmail}>Price: ${item.price}</p>
                  </>
                )}
                {activeTab === "request" && (
                  <>
                    <p style={styles.resultName}>{item.title}</p>
                    <p style={styles.resultEmail}>Status: {item.status}</p>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column" as const,
    // Removed alignItems: "center" to allow left alignment
    paddingTop: "20px",
    backgroundColor: "#ffffff",
    minHeight: "100vh",
    width: "100%", // Full width of the container
    maxWidth: "100%", // Allow full stretching
    boxSizing: "border-box" as const,
  },
  tabList: {
    display: "flex",
    margin: "20px 0", // Removed "auto" to prevent centering, keeping left alignment
    border: "1px solid #c5dacd",
    borderRadius: "6px",
    overflow: "hidden",
    backgroundColor: "#f2f9f4",
    width: "100%", // Full width, but aligned to the left
    maxWidth: "none", // Allow full stretching
  },
  tabButton: {
    flex: 1,
    padding: "12px 0",
    backgroundColor: "#f2f9f4",
    border: "none",
    fontSize: "16px",
    color: "#3d5943",
    cursor: "pointer",
  },
  activeTab: {
    backgroundColor: "#d9e8dc",
    color: "#2f4936",
    fontWeight: "bold",
    borderBottom: "2px solid #5fa86f",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    margin: "18px 0", // Removed "auto" to prevent centering
    width: "100%", // Corrected from "120%" to "100%"
    maxWidth: "none", // Allow full stretching
  },
  input: {
    width: "100%",
    padding: "14px 48px 14px 14px",
    borderRadius: "6px",
    border: "1px solid #b7d2bd",
    fontSize: "16px",
    outline: "none",
    backgroundColor: "#f8fbf9",
    boxSizing: "border-box" as const,
  },
  searchButton: {
    position: "absolute",
    right: "10px",
    background: "#5fa86f",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: "16px",
  },
  loadingText: {
    marginTop: "16px",
    fontSize: "14px",
    color: "#666",
    textAlign: "center" as const,
  },
  resultsContainer: {
    marginTop: "20px",
    width: "100%", // Corrected from "400%" to "100%"
    maxWidth: "none", // Allow full stretching
  },
  resultCard: {
    backgroundColor: "#f1f8f3",
    borderRadius: "6px",
    padding: "12px 16px",
    marginBottom: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    border: "1px solid #d3e7d6",
  },
  resultName: {
    fontSize: "16px",
    fontWeight: "bold",
    margin: "0 0 4px",
    color: "#2f4936",
  },
  resultEmail: {
    fontSize: "14px",
    margin: 0,
    color: "#4f6d58",
  },
  noResults: {
    textAlign: "center" as const,
    color: "#889c91",
    fontSize: "14px",
    marginTop: "10px",
  },
};