import "./App.css";
import { useEffect, useState, useCallback } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const PER_PAGE = 5;

  const fetchUsers = useCallback(async () => {
    if (!query.trim()) {
      setUsers([]);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://api.github.com/search/users?q=${query}&page=${page}&per_page=${PER_PAGE}`
      );

      if (!res.ok) {
        throw new Error("GitHub API error");
      }

      const data = await res.json();
      setUsers(data.items || []);
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }, [query, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = () => {
    setPage(1);
  };

  return (
    <div className="container">
      <h1>GitHub User Search</h1>

      {/* Search bar */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search GitHub username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Loading */}
      {loading && <p className="status">Loading...</p>}

      {/* Error (sirf jab real error ho) */}
      {!loading && error && <p className="status error">{error}</p>}

      {/* Results */}
      <div className="results">
        {users.map((user) => (
          <a
            key={user.id}
            href={user.html_url}
            target="_blank"
            rel="noreferrer"
            className="user-card"
          >
            <img src={user.avatar_url} alt={user.login} />
            <span>{user.login}</span>
          </a>
        ))}
      </div>

      {/* Pagination */}
      {users.length > 0 && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>

          <span>Page {page}</span>

          <button onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
