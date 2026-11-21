import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const APP_NAME = "Alumni-Bridge";

const ROLES = [
  { value: "junior", label: "I'm a student" },
  { value: "alumni", label: "I'm an alumni" },
];

const Login = () => {
  const location = useLocation();

  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState(location.state?.role || "junior");
  const [company, setCompany] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  const [isLoginForm, setIsLoginForm] = useState(location.state?.mode === "login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAlumni = role === "alumni";

  const emailHint = isAlumni
    ? "Alumni must use a @gmail.com address."
    : "Use a @gmail.com or @chitkara.edu.in address.";

  const getErrorMessage = (err) =>
    err?.response?.data?.message ||
    (typeof err?.response?.data === "string" ? err.response.data : "") ||
    "Something went wrong. Please try again.";

  // =========================================================
  // LOGIN
  // =========================================================
  const handleLogin = async () => {
    if (!emailId.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    try {
      setError("");
      setLoading(true);
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId: emailId.trim(), password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // SIGN UP
  // =========================================================
  const handleSignUp = async () => {
    const email = emailId.trim().toLowerCase();

    if (firstName.trim().length < 2) {
      setError("First name should be at least 2 characters.");
      return;
    }
    if (lastName.trim().length < 2) {
      setError("Last name should be at least 2 characters.");
      return;
    }
    if (!email) {
      setError("Email is required.");
      return;
    }
    const emailOk = isAlumni
      ? email.endsWith("@gmail.com")
      : email.endsWith("@gmail.com") || email.endsWith("@chitkara.edu.in");
    if (!emailOk) {
      setError(emailHint);
      return;
    }
    if (!password.trim()) {
      setError("Password is required.");
      return;
    }
    if (isAlumni && !company.trim()) {
      setError("Please enter the company you work at.");
      return;
    }
    if (isAlumni && !jobRole.trim()) {
      setError("Please enter your job role.");
      return;
    }

    try {
      setError("");
      setLoading(true);

      // alumni-only fields are sent only for alumni
      const alumniData = isAlumni
        ? {
            company: company.trim(),
            jobRole: jobRole.trim(),
            ...(linkedinUrl.trim() && { linkedinUrl: linkedinUrl.trim() }),
          }
        : {};

      const res = await axios.post(
        BASE_URL + "/signup",
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          emailId: email,
          password,
          role,
          ...alumniData,
        },
        { withCredentials: true }
      );

      dispatch(addUser(res.data.data));
      navigate("/profile");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // SWITCH LOGIN / SIGNUP
  // =========================================================
  const toggleForm = () => {
    setIsLoginForm((value) => !value);
    setError("");
    setShowPassword(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    isLoginForm ? handleLogin() : handleSignUp();
  };

  // regular weight for typed text (inline so no other style can make it bold)
  const inputStyle = { fontWeight: 400 };

  const inputClass =
    "input input-bordered w-full h-12 rounded-xl bg-base-100 text-base text-white border-white/15 placeholder:text-white/40 focus:border-primary";
  const legendClass =
    "fieldset-legend text-xs font-semibold uppercase tracking-wider text-white/70";

  // white icons that always sit above the input
  const iconClass =
    "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 z-10 w-5 h-5 text-white";

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-4 py-10 bg-base-100">
      {/* HIDE BROWSER PASSWORD EYE */}
      <style>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear { display: none; }
        input[type="password"]::-webkit-credentials-auto-fill-button {
          visibility: hidden; display: none !important; pointer-events: none;
        }
      `}</style>

      <div className="w-full max-w-md">
        {/* BRAND */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">{APP_NAME}</h1>
          <p className="text-sm text-white/60 mt-3 leading-relaxed">
            Learn from seniors who already cracked it.
          </p>
        </div>

        {/* CARD */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl bg-base-200 border border-white/10 shadow-2xl p-6 sm:p-8"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {isLoginForm ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-sm text-white/60 mt-2">
              {isLoginForm
                ? "Enter your details to continue."
                : "Connect with Chitkara students and alumni."}
            </p>
          </div>

          {/* ROLE TOGGLE (signup only) */}
          {!isLoginForm && (
            <div
              role="radiogroup"
              aria-label="Choose your role"
              className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-base-100 border border-white/10 mb-4"
            >
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  role="radio"
                  aria-checked={role === r.value}
                  onClick={() => {
                    setRole(r.value);
                    setError("");
                  }}
                  className={`h-11 rounded-lg text-sm font-semibold transition-colors ${
                    role === r.value
                      ? "bg-primary text-primary-content"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}

          {/* FIRST + LAST NAME */}
          {!isLoginForm && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <fieldset className="fieldset">
                <legend className={legendClass}>First name</legend>
                <input
                  type="text"
                  value={firstName}
                  autoComplete="given-name"
                  style={inputStyle}
                  className={inputClass}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setError("");
                  }}
                  placeholder="First name"
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className={legendClass}>Last name</legend>
                <input
                  type="text"
                  value={lastName}
                  autoComplete="family-name"
                  style={inputStyle}
                  className={inputClass}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setError("");
                  }}
                  placeholder="Last name"
                />
              </fieldset>
            </div>
          )}

          {/* EMAIL */}
          <fieldset className="fieldset mt-3">
            <legend className={legendClass}>Email address</legend>
            <div className="relative">
              {/* WHITE EMAIL ICON */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className={iconClass}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              <input
                type="email"
                value={emailId}
                autoComplete="email"
                style={inputStyle}
                className={`${inputClass} pl-12`}
                onChange={(e) => {
                  setEmailId(e.target.value);
                  setError("");
                }}
                placeholder={isAlumni ? "you@gmail.com" : "you@chitkara.edu.in"}
              />
            </div>
            {!isLoginForm && (
              <p className="text-xs text-white/50 mt-2">{emailHint}</p>
            )}
          </fieldset>

          {/* PASSWORD */}
          <fieldset className="fieldset mt-3">
            <legend className={legendClass}>Password</legend>
            <div className="relative">
              {/* WHITE LOCK ICON */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className={iconClass}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                autoComplete={isLoginForm ? "current-password" : "new-password"}
                style={inputStyle}
                className={`${inputClass} pl-12 pr-12`}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter your password"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-lg text-white hover:bg-white/10 transition-colors"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.86C2.84 10.2 2.25 12 2.25 12s3.75 6.75 9.75 6.75c1.45 0 2.72-.32 3.82-.82M6.23 6.23C7.77 5.3 9.61 5.25 12 5.25c6 0 9.75 6.75 9.75 6.75s-.59 1.8-1.73 3.14M6.23 6.23l11.54 11.54M9.88 9.88a3 3 0 104.24 4.24" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12s-3.75 6.75-9.75 6.75S2.25 12 2.25 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {!isLoginForm && (
              <p className="text-xs text-white/50 mt-2">
                At least 8 characters with uppercase, lowercase, a number and a symbol.
              </p>
            )}
          </fieldset>

          {/* ALUMNI-ONLY FIELDS */}
          {!isLoginForm && isAlumni && (
            <div className="mt-3 pt-4 border-t border-white/10">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/70 mb-1">
                Your work details
              </p>
              <p className="text-xs text-white/50 mb-2">
                Students will find you by company and role.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <fieldset className="fieldset">
                  <legend className={legendClass}>Company</legend>
                  <input
                    type="text"
                    value={company}
                    style={inputStyle}
                    className={inputClass}
                    onChange={(e) => {
                      setCompany(e.target.value);
                      setError("");
                    }}
                    placeholder="e.g. Google"
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className={legendClass}>Job role</legend>
                  <input
                    type="text"
                    value={jobRole}
                    style={inputStyle}
                    className={inputClass}
                    onChange={(e) => {
                      setJobRole(e.target.value);
                      setError("");
                    }}
                    placeholder="e.g. SDE"
                  />
                </fieldset>
              </div>

              <fieldset className="fieldset mt-1">
                <legend className={legendClass}>LinkedIn URL (optional)</legend>
                <input
                  type="url"
                  value={linkedinUrl}
                  style={inputStyle}
                  className={inputClass}
                  onChange={(e) => {
                    setLinkedinUrl(e.target.value);
                    setError("");
                  }}
                  placeholder="https://linkedin.com/in/your-name"
                />
              </fieldset>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div
              role="alert"
              className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3"
            >
              <p className="text-red-300 text-sm text-center font-medium">
                {error}
              </p>
            </div>
          )}

          {/* MAIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full h-12 mt-6 rounded-xl text-base font-semibold"
          >
            {loading
              ? "Please wait..."
              : isLoginForm
              ? "Log in"
              : "Create account"}
          </button>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-xs font-semibold tracking-widest text-white/40">
              OR
            </span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>

          {/* SWITCH LOGIN / SIGNUP */}
          <div className="text-center">
            <p className="text-sm text-white/60">
              {isLoginForm ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              type="button"
              onClick={toggleForm}
              className="mt-2 text-sm font-semibold text-primary hover:underline underline-offset-4"
            >
              {isLoginForm ? "Create an account" : "Log in to your account"}
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-white/40 mt-6">
          Built for Chitkara students and alumni.
        </p>
      </div>
    </div>
  );
};

export default Login;