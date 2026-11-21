import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";

const DEFAULT_PHOTO = "https://cdn-icons-png.flaticon.com/512/219/219969.png";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const isAlumni = user?.role === "alumni";

  const reviewRequests = async (status, requestId) => {
    try {
      setBusyId(requestId);
      setError("");
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + requestId,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(requestId));
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : "");
      setError(msg || "Could not update the request. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (err) {
      setError("Could not load requests. Please refresh the page.");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // ---------- LOADING ----------
  if (!requests) {
    return (
      <div className="min-h-[50dvh] flex items-center justify-center">
        <span className="loading loading-spinner loading-md text-primary" />
      </div>
    );
  }

  // ---------- EMPTY ----------
  if (requests.length === 0) {
    return (
      <div className="min-h-[60dvh] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm text-center rounded-2xl bg-base-200 border border-white/10 p-8">
          <h2 className="text-xl font-bold">No requests yet</h2>
          <p className="text-sm text-base-content/70 mt-2 leading-relaxed">
            {isAlumni
              ? "When a student asks you for help, the request will appear here."
              : "Requests you send to alumni show up in Connections once they accept."}
          </p>
          {!isAlumni && (
            <Link to="/" className="btn btn-primary rounded-xl mt-6 px-8">
              Find mentors
            </Link>
          )}
        </div>
      </div>
    );
  }

  // ---------- LIST ----------
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold">Requests</h1>
        <p className="text-sm text-base-content/70 mt-2">
          {requests.length} {requests.length === 1 ? "student needs" : "students need"} your help
        </p>
      </div>

      {error && (
        <p role="alert" className="mb-5 text-center text-sm text-error">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-4">
        {requests.map((request) => {
          const person = request.fromUserId;
          if (!person) return null;

          const {
            firstName,
            lastName,
            photoUrl,
            about,
            branch,
            batchYear,
            skills = [],
          } = person;

          const meta = [branch, batchYear ? `Batch ${batchYear}` : null]
            .filter(Boolean)
            .join(" · ");
          const busy = busyId === request._id;

          return (
            <article
              key={request._id}
              className="rounded-2xl bg-base-200 border border-white/10 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-5 transition-colors hover:border-primary/40"
            >
              {/* PERSON */}
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <img
                  src={photoUrl || DEFAULT_PHOTO}
                  alt={`${firstName} ${lastName || ""}`.trim()}
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_PHOTO;
                  }}
                  className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-full object-cover bg-base-300 ring-2 ring-primary"
                />
                <div className="min-w-0 text-left">
                  <h2 className="text-lg sm:text-xl font-bold truncate">
                    {firstName} {lastName}
                  </h2>
                  {meta && (
                    <p className="text-sm text-base-content/70 truncate">{meta}</p>
                  )}
                  {about && (
                    <p className="text-sm text-base-content/80 mt-1 line-clamp-2">
                      {about}
                    </p>
                  )}
                  {skills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {skills.slice(0, 4).map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-0.5 rounded-full bg-primary/15 text-accent text-xs"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* BUTTONS */}
              <div className="grid grid-cols-2 sm:flex gap-3 sm:shrink-0">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => reviewRequests("rejected", request._id)}
                  className="btn btn-outline h-11 rounded-xl border-white/20 text-base-content hover:bg-white/5 hover:border-white/40"
                >
                  Decline
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => reviewRequests("accepted", request._id)}
                  className="btn btn-primary h-11 rounded-xl px-6"
                >
                  {busy ? "Please wait..." : "Accept"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;