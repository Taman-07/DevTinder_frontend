import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const DEFAULT_PHOTO = "https://cdn-icons-png.flaticon.com/512/219/219969.png";

// makes sure the LinkedIn link always opens as an https address
const toSafeUrl = (url) => {
  if (!url) return null;
  const u = url.trim();
  if (/^https?:\/\//i.test(u)) return u;
  if (/^[a-z][a-z0-9+.-]*:/i.test(u)) return null; // blocks things like javascript:
  return "https://" + u;
};

const UserCard = ({ user }) => {
  const {
    _id,
    firstName,
    lastName,
    about,
    photoUrl,
    skills = [],
    company,
    jobRole,
    branch,
    batchYear,
    linkedinUrl,
  } = user;

  const dispatch = useDispatch();
  const [status, setStatus] = useState(null); // null | "interested" | "ignored"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendRequest = async (newStatus) => {
    try {
      setLoading(true);
      setError("");
      await axios.post(
        BASE_URL + "/request/send/" + newStatus + "/" + _id,
        {},
        { withCredentials: true }
      );
      setStatus(newStatus);
      // removes the card from the feed list (search results stay and show the status)
      dispatch(removeUserFromFeed(_id));
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : "");
      setError(msg || "Could not send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const shownSkills = skills.slice(0, 6);
  const extraSkills = skills.length - shownSkills.length;
  const linkedin = toSafeUrl(linkedinUrl);
  const meta = [branch, batchYear ? `Batch ${batchYear}` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="h-full flex flex-col rounded-3xl bg-base-200 border border-white/10 p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10">
      {/* PHOTO + NAME */}
      <div className="flex flex-col items-center text-center">
        <img
          src={photoUrl || DEFAULT_PHOTO}
          alt={`${firstName} ${lastName || ""}`.trim()}
          onError={(e) => {
            e.currentTarget.src = DEFAULT_PHOTO;
          }}
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover bg-base-300 ring-2 ring-primary ring-offset-4 ring-offset-base-200"
        />

        <h2 className="brand mt-5 text-2xl font-bold">
          {firstName} {lastName}
        </h2>

        {(company || jobRole) && (
          <p className="mt-2 text-base">
            {company ? (
              <>
                <span className="text-base-content/60">Placed at </span>
                <span className="font-semibold">{company}</span>
              </>
            ) : null}
            {company && jobRole ? <span className="text-base-content/40"> · </span> : null}
            {jobRole && <span>{jobRole}</span>}
          </p>
        )}

        {meta && <p className="mt-1 text-sm text-base-content/50">{meta}</p>}
      </div>

      {/* ABOUT */}
      {about && (
        <p className="mt-5 text-sm text-base-content/70 leading-relaxed text-center line-clamp-3">
          {about}
        </p>
      )}

      {/* SKILLS */}
      {shownSkills.length > 0 && (
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {shownSkills.map((s) => (
            <span
              key={s}
              className="px-3 py-1 rounded-full bg-primary/15 text-accent text-xs"
            >
              {s}
            </span>
          ))}
          {extraSkills > 0 && (
            <span className="px-3 py-1 rounded-full bg-base-300 text-base-content/60 text-xs">
              +{extraSkills} more
            </span>
          )}
        </div>
      )}

      {/* LINKEDIN */}
      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 text-center text-sm text-accent hover:underline underline-offset-4"
        >
          View LinkedIn profile ↗
        </a>
      )}

      {/* ACTIONS (pinned to the bottom so cards in a row line up) */}
      <div className="mt-auto pt-6">
        {status === "interested" && (
          <p className="text-center text-sm font-medium text-success py-3" role="status">
            Request sent. You'll see them in Connections once they accept.
          </p>
        )}
        {status === "ignored" && (
          <p className="text-center text-sm text-base-content/60 py-3" role="status">
            Skipped.
          </p>
        )}

        {!status && (
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSendRequest("ignored")}
              className="btn btn-outline h-12 rounded-xl border-white/20 text-base-content hover:bg-white/5 hover:border-white/40"
            >
              Skip
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSendRequest("interested")}
              className="btn btn-primary h-12 rounded-xl"
            >
              {loading ? "Sending..." : "Request help"}
            </button>
          </div>
        )}

        {error && (
          <p role="alert" className="mt-3 text-center text-sm text-red-300">
            {error}
          </p>
        )}
      </div>
    </article>
  );
};

export default UserCard;