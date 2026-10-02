import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addFeed } from "../utils/feedSlice";
import { useDispatch, useSelector } from "react-redux";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  const getFeed = async () => {
    if (feed?.length > 0) return;

    try {
      setRefreshing(true);
      const res = await axios.get(BASE_URL + "/feed", {
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

  // ---------- LOADING ----------
  if (!feed) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-sm rounded-3xl bg-base-300 border border-white/10 shadow-2xl overflow-hidden animate-pulse">
          <div className="h-80 bg-base-100/40" />
          <div className="p-6 space-y-4 flex flex-col items-center">
            <div className="h-5 w-40 rounded-full bg-base-100/50" />
            <div className="h-3 w-56 rounded-full bg-base-100/40" />
            <div className="flex gap-3 pt-2">
              <div className="h-10 w-24 rounded-xl bg-base-100/40" />
              <div className="h-10 w-28 rounded-xl bg-base-100/40" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- EMPTY ----------
  if (feed.length === 0) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-sm text-center rounded-3xl bg-base-300 border border-white/10 shadow-2xl p-10">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-3xl mb-5">
            🎉
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight">
            You're all caught up!
          </h2>

          <p className="text-sm text-base-content/60 mt-2 leading-relaxed">
            No new developers to show right now. Check back soon for new
            connections.
          </p>

          <button
            onClick={getFeed}
            disabled={refreshing}
            className="btn btn-primary rounded-xl mt-6 px-8 font-bold"
          >
            {refreshing ? "Checking..." : "Refresh"}
          </button>
        </div>
      </div>
    );
  }

  // ---------- FEED ----------
  return (
    <div className="relative min-h-[calc(100vh-8rem)] flex flex-col items-center px-5 py-10 overflow-hidden">
      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .card-in { animation: cardIn 0.45s ease-out both; }
      `}</style>

      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] rounded-full bg-primary/20 blur-3xl" />

      {/* HEADER */}
      <div className="relative text-center mb-8">
        <h1 className="text-4xl font-black tracking-tight">
          Discover{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Developers
          </span>
        </h1>

        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-base-content/50 mt-3">
          {feed.length} {feed.length === 1 ? "profile" : "profiles"} waiting for
          you
        </p>
      </div>

      {/* CARD */}
      <div key={feed[0]?._id} className="relative card-in">
        <UserCard user={feed[0]} />
      </div>
    </div>
  );
};

export default Feed;