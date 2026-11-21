import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import UserCard from "./UserCard";

const inputClass =
  "input input-bordered w-full h-12 rounded-xl bg-base-100 text-base text-white border-white/15 placeholder:text-white/40 focus:border-primary";
const legendClass =
  "fieldset-legend text-xs font-semibold uppercase tracking-wider text-white/70";
const regular = { fontWeight: 400 };

const Field = ({ label, hint, children }) => (
  <fieldset className="fieldset">
    <legend className={legendClass}>{label}</legend>
    {children}
    {hint && <p className="text-xs text-white/50 mt-1">{hint}</p>}
  </fieldset>
);

const EditProfile = ({ user }) => {
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [age, setAge] = useState(user?.age || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [about, setAbout] = useState(user?.about || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "");
  const [branch, setBranch] = useState(user?.branch || "");
  const [batchYear, setBatchYear] = useState(user?.batchYear || "");
  const [skillsText, setSkillsText] = useState((user?.skills || []).join(", "));
  const [company, setCompany] = useState(user?.company || "");
  const [jobRole, setJobRole] = useState(user?.jobRole || "");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // hide the toast after 3 seconds
  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(t);
  }, [showToast]);

  if (!user) {
    return (
      <div className="min-h-[50dvh] flex items-center justify-center">
        <span className="loading loading-spinner loading-md text-primary" />
      </div>
    );
  }

  const isAlumni = user.role === "alumni";

  // "DSA, React, , DSA" -> ["DSA", "React"]
  const skills = [
    ...new Set(
      skillsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    ),
  ];

  const saveProfile = async () => {
    setError("");

    if (firstName.trim().length < 2) {
      setError("First name should be at least 2 characters.");
      return;
    }
    if (isAlumni && (!company.trim() || !jobRole.trim())) {
      setError("Company and job role are required for alumni.");
      return;
    }
    if (skills.length > 20) {
      setError("Please add 20 skills at most.");
      return;
    }

    // only send fields that have a value (the server rejects empty gender / age)
    const payload = {
      firstName: firstName.trim(),
      about,
      skills,
      ...(lastName.trim() && { lastName: lastName.trim() }),
      ...(photoUrl.trim() && { photoUrl: photoUrl.trim() }),
      ...(age !== "" && { age: Number(age) }),
      ...(gender && { gender }),
      ...(branch.trim() && { branch: branch.trim() }),
      ...(batchYear !== "" && { batchYear: Number(batchYear) }),
      ...(isAlumni && {
        company: company.trim(),
        jobRole: jobRole.trim(),
      }),
    };

    try {
      setSaving(true);
      const res = await axios.patch(BASE_URL + "/profile/edit", payload, {
        withCredentials: true,
      });
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const data = err?.response?.data;
      setError(
        (typeof data === "string" && data) ||
          data?.message ||
          "Could not save your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* PAGE: form card on the left, profile card on the right */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-8 items-start">
        {/* ===== EDIT PROFILE CARD (split into two halves) ===== */}
        <div className="w-full rounded-2xl bg-base-200 border border-white/10 p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold">Edit profile</h1>
            <p className="text-sm text-white/60 mt-1">
              {isAlumni
                ? "Students find you by company and role, so keep these up to date."
                : "A complete profile helps alumni understand how to help you."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
            {/* LEFT HALF */}
            <div className="md:pr-10 md:border-r md:border-white/10">
              <Field label="First name">
                <input
                  type="text"
                  value={firstName}
                  style={regular}
                  className={inputClass}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                />
              </Field>

              <Field label="Last name">
                <input
                  type="text"
                  value={lastName}
                  style={regular}
                  className={inputClass}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                />
              </Field>

              <Field label="About">
                <textarea
                  value={about}
                  style={regular}
                  rows={4}
                  maxLength={500}
                  className="textarea textarea-bordered w-full rounded-xl bg-base-100 text-base text-white border-white/15 placeholder:text-white/40 focus:border-primary"
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder={
                    isAlumni
                      ? "How can you help students? Resume reviews, mock interviews, referrals..."
                      : "Tell alumni about your goals and what help you need"
                  }
                />
              </Field>

              <Field
                label="Skills"
                hint="Separate with commas, e.g. DSA, React, System Design"
              >
                <input
                  type="text"
                  value={skillsText}
                  style={regular}
                  className={inputClass}
                  onChange={(e) => setSkillsText(e.target.value)}
                  placeholder="DSA, React, Resume review"
                />
              </Field>
            </div>

            {/* RIGHT HALF */}
            <div className="mt-2 md:mt-0">
              {isAlumni && (
                <>
                  <Field label="Company">
                    <input
                      type="text"
                      value={company}
                      style={regular}
                      className={inputClass}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Google"
                    />
                  </Field>

                  <Field label="Job role">
                    <input
                      type="text"
                      value={jobRole}
                      style={regular}
                      className={inputClass}
                      onChange={(e) => setJobRole(e.target.value)}
                      placeholder="e.g. SDE"
                    />
                  </Field>
                </>
              )}

              <div className="grid grid-cols-2 gap-x-4">
                <Field label="Branch">
                  <input
                    type="text"
                    value={branch}
                    style={regular}
                    className={inputClass}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="e.g. CSE"
                  />
                </Field>

                <Field label="Batch year">
                  <input
                    type="number"
                    value={batchYear}
                    style={regular}
                    className={inputClass}
                    onChange={(e) => setBatchYear(e.target.value)}
                    placeholder="e.g. 2024"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-x-4">
                <Field label="Gender">
                  <select
                    value={gender}
                    style={regular}
                    className="select select-bordered w-full h-12 rounded-xl bg-base-100 text-base text-white border-white/15 focus:border-primary"
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Prefer not to say</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </Field>

                <Field label="Age">
                  <input
                    type="number"
                    value={age}
                    style={regular}
                    className={inputClass}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Age"
                  />
                </Field>
              </div>

              <Field label="Photo URL">
                <input
                  type="text"
                  value={photoUrl}
                  style={regular}
                  className={inputClass}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://..."
                />
              </Field>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3"
            >
              <p className="text-sm text-center font-medium text-error">{error}</p>
            </div>
          )}

          {/* SAVE BUTTON: centered at the bottom of the card */}
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={saveProfile}
              disabled={saving}
              className="btn btn-primary h-12 rounded-xl px-14 text-base"
            >
              {saving ? "Saving..." : "Save profile"}
            </button>
          </div>
        </div>

        {/* ===== PROFILE CARD (one normal card, updates as you type) ===== */}
        <div className="w-full max-w-sm mx-auto lg:sticky lg:top-24">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-3 text-center">
            Preview
          </p>
          <UserCard
            preview
            user={{
              firstName,
              lastName,
              photoUrl,
              about,
              skills,
              branch,
              batchYear,
              ...(isAlumni && { company, jobRole}),
            }}
          />
        </div>
      </div>

      {/* TOAST: below the navbar, above everything else */}
      {showToast && (
        <div
          role="status"
          className="fixed top-20 inset-x-0 z-[60] flex justify-center px-4 pointer-events-none"
        >
          <div className="alert alert-success shadow-2xl rounded-xl">
            <span className="font-semibold">Profile saved successfully</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;