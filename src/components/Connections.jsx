import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const DEFAULT_PHOTO = "https://cdn-icons-png.flaticon.com/512/219/219969.png";

// makes sure the LinkedIn link always opens as an https address
const toSafeUrl = (url) => {
  if (!url) return null;
  const u = url.trim();
  if (/^https?:\/\//i.test(u)) return u;
  if (/^[a-z][a-z0-9+.-]*:/i.test(u)) return null;
  return "https://" + u;
};

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const isAlumni = user?.role === "alumni";

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      setError("Could not load connections. Please refresh the page.");
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  // ---------- LOADING ----------
  if (!connections) {
    return (
      <div className="min-h-[50dvh] flex items-center justify-center">
        {error ? (
          <p role="alert" className="text-sm text-error">{error}</p>
        ) : (
          <span className="loading loading-spinner loading-md text-primary" />
        )}
      </div>
    );
  }

  // ---------- EMPTY ----------
  if (connections.length === 0) {
    return (
      <div className="min-h-[60dvh] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm text-center rounded-2xl bg-base-200 border border-white/10 p-8">
          <h2 className="text-xl font-bold">No connections yet</h2>
          <p className="text-sm text-base-content/70 mt-2 leading-relaxed">
            {isAlumni
              ? "Accept a student's request and they will show up here, ready to chat."
              : "Once an alumnus accepts your request, you can chat with them here."}
          </p>
          <Link
            to={isAlumni ? "/requests" : "/"}
            className="btn btn-primary rounded-xl mt-6 px-8"
          >
            {isAlumni ? "View requests" : "Find mentors"}
          </Link>
        </div>
      </div>
    );
  }

  // ---------- LIST ----------
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold">Connections</h1>
        <p className="text-sm text-base-content/70 mt-2">
          {connections.length} {connections.length === 1 ? "connection" : "connections"}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {connections.map((person) => {
          if (!person) return null;
          const {
            _id,
            firstName,
            lastName,
            photoUrl,
            about,
            role,
            company,
            jobRole,
            branch,
            batchYear,
            linkedinUrl,
          } = person;

          const meta = [branch, batchYear ? `Batch ${batchYear}` : null]
            .filter(Boolean)
            .join(" · ");
          const linkedin = toSafeUrl(linkedinUrl);

          return (
            <article
              key={_id}
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

                  {role === "alumni" && (company || jobRole) && (
                    <p className="text-sm mt-0.5 truncate">
                      {company && (
                        <>
                          <span className="text-base-content/70">Placed at </span>
                          <span className="font-semibold">{company}</span>
                        </>
                      )}
                      {company && jobRole ? " · " : null}
                      {jobRole}
                    </p>
                  )}

                  {meta && (
                    <p className="text-sm text-base-content/70 truncate">{meta}</p>
                  )}

                  {about && (
                    <p className="text-sm text-base-content/80 mt-1 line-clamp-1">
                      {about}
                    </p>
                  )}

                  {linkedin && (
                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-1 text-sm text-accent hover:underline underline-offset-4"
                    >
                      LinkedIn ↗
                    </a>
                  )}
                </div>
              </div>

              {/* CHAT */}
              <Link
                to={"/chat/" + _id}
                className="btn btn-primary h-11 rounded-xl px-8 sm:shrink-0"
              >
                Chat
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;