import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addFeed } from "../utils/feedSlice";
import { useDispatch, useSelector } from "react-redux";
import UserCard from "./UserCard";

// how many cards to show at once: 3 = one row, 6 = two rows (on desktop)
const VISIBLE_CARDS = 6;

// quick-search chips: change these to companies your alumni work at
const QUICK_SEARCHES = ["Google", "Amazon", "Microsoft", "SDE"];

const GRID = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  // search state
  const [q, setQ] = useState("");
  const [results, setResults] = useState(null); // null = not searching
  const [searching, setSearching] = useState(false);

  const isAlumni = user?.role === "alumni";
  const term = q.trim();

  const getFeed = async () => {
    if (feed?.length > 0) return;
    try {
      setRefreshing(true);
      const res = await axios.get(BASE_URL + "/feed", {
        params: { limit: 12 },
        withCredentials: true,
      });
      dispatch(addFeed(res.data));
    } catch (err) {
      console.log(err.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  // wait 400 ms after typing stops, so we don't call the API on every key press
  useEffect(() => {
    if (!term) {
      setResults(null);
      setSearching(false);
      return;
    }
    let cancelled = false;
    setSearching(true);
    const t = setTimeout(async () => {
      try {
        const res = await axios.get(BASE_URL + "/user/search", {
          params: { q: term },
          withCredentials: true,
        });
        if (!cancelled) setResults(res.data.data);
      } catch (err) {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [term]);

  // ---------- SEARCH SECTION ----------
  const renderSearch = () => (
    <section className="w-full max-w-xl" aria-label="Search alumni">
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40 pointer-events-none"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>

        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && setQ("")}
          placeholder="Search by name, company or role"
          aria-label="Search alumni by name, company or role"
          style={{ fontWeight: 400 }}
          className="input input-bordered w-full h-12 pl-12 pr-12 bg-base-200 text-base rounded-xl"
        />

        {q && (
          <button
            type="button"
            onClick={() => setQ("")}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center text-base-content/60 hover:text-base-content hover:bg-base-300"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}
      </div>

      {/* quick searches */}
      <div className="flex flex-wrap justify-center gap-2 mt-3">
        {QUICK_SEARCHES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setQ(s)}
            className={`px-3 h-8 rounded-full text-xs border transition-colors ${
              term.toLowerCase() === s.toLowerCase()
                ? "bg-primary text-primary-content border-primary"
                : "bg-base-200 border-base-content/15 text-base-content/70 hover:border-base-content/40"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </section>
  );

  // ---------- BODY (what shows under the search section) ----------
  const renderBody = () => {
    // searching
    if (results !== null || searching) {
      if (searching) {
        return <p className="text-sm text-base-content/60 text-center">Searching...</p>;
      }
      if (results.length === 0) {
        return (
          <div className="w-full max-w-sm text-center rounded-2xl bg-base-200 border border-base-content/10 p-8">
            <h2 className="text-lg font-bold">No alumni found</h2>
            <p className="text-sm text-base-content/60 mt-2">
              Try a different company, name or role.
            </p>
            <button onClick={() => setQ("")} className="btn btn-outline rounded-xl mt-5">
              Clear search
            </button>
          </div>
        );
      }
      return (
        <div className="w-full">
          <p className="text-xs uppercase tracking-widest text-base-content/50 text-center mb-5">
            {results.length} {results.length === 1 ? "result" : "results"} for "{term}"
          </p>
          <div className={GRID}>
            {results.map((alum) => (
              <div key={alum._id} className="card-in">
                <UserCard user={alum} />
              </div>
            ))}
          </div>
        </div>
      );
    }

    // loading
    if (!feed) {
      return (
        <div className={GRID}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-3xl bg-base-200 border border-base-content/10 p-7 animate-pulse flex flex-col items-center gap-4"
            >
              <div className="w-28 h-28 rounded-full bg-base-300" />
              <div className="h-5 w-40 rounded-full bg-base-300" />
              <div className="h-3 w-56 rounded-full bg-base-300" />
              <div className="h-3 w-48 rounded-full bg-base-300" />
              <div className="grid grid-cols-2 gap-3 w-full pt-4">
                <div className="h-12 rounded-xl bg-base-300" />
                <div className="h-12 rounded-xl bg-base-300" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    // empty
    if (feed.length === 0) {
      return (
        <div className="w-full max-w-sm text-center rounded-2xl bg-base-200 border border-base-content/10 p-8">
          <div className="mx-auto w-14 h-14 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary text-2xl mb-5">
            ✓
          </div>
          <h2 className="text-xl font-bold">You're all caught up</h2>
          <p className="text-sm text-base-content/60 mt-2 leading-relaxed">
            No new alumni to show right now. Check back soon, or search by
            company or name.
          </p>
          <button
            onClick={getFeed}
            disabled={refreshing}
            className="btn btn-primary rounded-xl mt-6 px-8"
          >
            {refreshing ? "Checking..." : "Refresh"}
          </button>
        </div>
      );
    }

    // feed: several cards in a grid
    return (
      <div className={GRID}>
        {feed.slice(0, VISIBLE_CARDS).map((alum) => (
          <div key={alum._id} className="card-in">
            <UserCard user={alum} />
          </div>
        ))}
      </div>
    );
  };

  // ---------- PAGE (same page for students and alumni) ----------
  return (
    <div className="w-full max-w-6xl mx-auto min-h-[calc(100dvh-8rem)] flex flex-col items-center px-4 sm:px-6 py-10 gap-8">
      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .card-in { animation: cardIn 0.35s ease-out both; height: 100%; }
      `}</style>

      <div className="text-center">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
          {isAlumni ? (
            <>
              Meet fellow <span className="text-primary">alumni</span>
            </>
          ) : (
            <>
              Find your <span className="text-primary">mentor</span>
            </>
          )}
        </h1>
        <p className="text-sm text-base-content/60 mt-3 max-w-md mx-auto">
          {isAlumni
            ? "Connect with other Chitkara alumni, grow your network and see where everyone is placed."
            : "Request help from alumni who are already placed in top companies."}
        </p>
        {Array.isArray(feed) && feed.length > 0 && results === null && !searching && (
          <p className="text-xs uppercase tracking-[0.2em] text-base-content/50 mt-4">
            {feed.length} {feed.length === 1 ? "alumnus" : "alumni"} to explore
          </p>
        )}
      </div>

      {renderSearch()}
      {renderBody()}
    </div>
  );
};

export default Feed;