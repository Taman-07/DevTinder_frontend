import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // =========================================================
  // LOGIN
  // =========================================================

  const handleLogin = async () => {
    try {
      setError("");

      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId,
          password,
        },
        {
          withCredentials: true,
        }
      );

      dispatch(addUser(res.data));

      navigate("/");
    } catch (err) {
      console.log(err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          "Something went wrong!"
      );
    }
  };

  // =========================================================
  // SIGN UP
  // =========================================================

  const handleSignUp = async () => {
    if (firstName.trim().length < 5) {
      setError("First name should be at least 5 characters.");
      return;
    }

    if (lastName.trim().length < 3) {
      setError("Last name should be at least 3 characters.");
      return;
    }

    if (!emailId.trim()) {
      setError("Email is required.");
      return;
    }

    if (!password.trim()) {
      setError("Password is required.");
      return;
    }

    try {
      setError("");

      const res = await axios.post(
        BASE_URL + "/signup",
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          emailId: emailId.trim(),
          password,
        },
        {
          withCredentials: true,
        }
      );

      console.log(res.data);

      dispatch(addUser(res.data.data));

      navigate("/profile");
    } catch (err) {
      console.log(err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          "Something went wrong!"
      );
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

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10 bg-base-200">

      {/* HIDE BROWSER PASSWORD EYE */}
      <style>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
        }

        input[type="password"]::-webkit-credentials-auto-fill-button {
          visibility: hidden;
          display: none !important;
          pointer-events: none;
        }
      `}</style>

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-md">

        {/* =====================================================
            BRAND
        ===================================================== */}

        <div className="text-center mb-8">

          <h1 className="text-5xl font-black tracking-tight">
            <span className="text-white">
              Pair
            </span>

            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              -Up
            </span>
          </h1>

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/80 mt-3">
            Connect • Collaborate • Code
          </p>

          <p className="text-sm text-white/60 mt-3 leading-relaxed">
            {isLoginForm
              ? "Welcome back, developer! Let's get you connected."
              : "Build connections. Collaborate. Grow together."}
          </p>

        </div>

        {/* =====================================================
            CARD
        ===================================================== */}

        <div className="card bg-neutral-900 border border-white/10 shadow-2xl rounded-3xl">

          <div className="card-body p-7 sm:p-9">

            {/* =================================================
                HEADING
            ================================================= */}

            <div className="mb-6">

              <h2 className="text-3xl font-extrabold tracking-tight text-white">
                {isLoginForm
                  ? "Welcome Back 👋"
                  : "Create Your Account 🚀"}
              </h2>

              <p className="text-sm text-white/60 mt-2">
                {isLoginForm
                  ? "Enter your details to continue."
                  : "Join a community of developers."}
              </p>

            </div>

            {/* =================================================
                FIRST NAME + LAST NAME
            ================================================= */}

            {!isLoginForm && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {/* FIRST NAME */}
                <fieldset className="fieldset">

                  <legend className="fieldset-legend text-xs font-semibold uppercase tracking-wider text-white/70">
                    First Name
                  </legend>

                  <input
                    type="text"
                    value={firstName}
                    className="input input-bordered w-full rounded-xl bg-black/40 text-white border-white/20 placeholder:text-white/40 focus:border-primary"
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      setError("");
                    }}
                    placeholder="First name"
                  />

                </fieldset>

                {/* LAST NAME */}
                <fieldset className="fieldset">

                  <legend className="fieldset-legend text-xs font-semibold uppercase tracking-wider text-white/70">
                    Last Name
                  </legend>

                  <input
                    type="text"
                    value={lastName}
                    className="input input-bordered w-full rounded-xl bg-black/40 text-white border-white/20 placeholder:text-white/40 focus:border-primary"
                    onChange={(e) => {
                      setLastName(e.target.value);
                      setError("");
                    }}
                    placeholder="Last name"
                  />

                </fieldset>

              </div>
            )}

            {/* =================================================
                EMAIL
            ================================================= */}

            <fieldset className="fieldset mt-3">

              <legend className="fieldset-legend text-xs font-semibold uppercase tracking-wider text-white/70">
                Email Address
              </legend>

              <div className="relative">

                {/* WHITE EMAIL ICON */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white"
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
                  className="input input-bordered w-full rounded-xl pl-12 bg-black/40 text-white border-white/20 placeholder:text-white/40 focus:border-primary"
                  onChange={(e) => {
                    setEmailId(e.target.value);
                    setError("");
                  }}
                  placeholder="you@example.com"
                />

              </div>

            </fieldset>

            {/* =================================================
                PASSWORD
            ================================================= */}

            <fieldset className="fieldset mt-3">

              <legend className="fieldset-legend text-xs font-semibold uppercase tracking-wider text-white/70">
                Password
              </legend>

              <div className="relative">

                {/* WHITE LOCK ICON */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white"
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
                  autoComplete={
                    isLoginForm
                      ? "current-password"
                      : "new-password"
                  }
                  className="input input-bordered w-full rounded-xl pl-12 pr-12 bg-black/40 text-white border-white/20 placeholder:text-white/40 focus:border-primary"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your password"
                />

                {/* =================================================
                    SINGLE WHITE EYE BUTTON
                ================================================= */}

                <button
                  type="button"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-lg text-white hover:bg-white/10 transition-all duration-200"
                >

                  {showPassword ? (

                    /* EYE OFF */
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-5 h-5 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.86C2.84 10.2 2.25 12 2.25 12s3.75 6.75 9.75 6.75c1.45 0 2.72-.32 3.82-.82M6.23 6.23C7.77 5.3 9.61 5.25 12 5.25c6 0 9.75 6.75 9.75 6.75s-.59 1.8-1.73 3.14M6.23 6.23l11.54 11.54M9.88 9.88a3 3 0 104.24 4.24"
                      />
                    </svg>

                  ) : (

                    /* EYE */
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-5 h-5 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12s-3.75 6.75-9.75 6.75S2.25 12 2.25 12z"
                      />

                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                      />
                    </svg>

                  )}

                </button>

              </div>

              {/* PASSWORD HELPER */}
              {!isLoginForm && (
                <p className="text-xs text-white/40 mt-2">
                  Use a strong password to keep your account secure.
                </p>
              )}

            </fieldset>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">

                <p className="text-red-400 text-sm text-center font-medium">
                  {error}
                </p>

              </div>
            )}

            {/* =================================================
                MAIN BUTTON
            ================================================= */}

            <button
              className="btn btn-primary w-full mt-6 rounded-xl text-base font-bold tracking-wide shadow-lg hover:shadow-primary/20 transition-all duration-300"
              onClick={
                isLoginForm
                  ? handleLogin
                  : handleSignUp
              }
            >
              {isLoginForm
                ? "Login to Pair-Up"
                : "Create Account"}
            </button>

            {/* =================================================
                DIVIDER
            ================================================= */}

            <div className="flex items-center gap-3 my-6">

              <div className="h-px bg-white/10 flex-1"></div>

              <span className="text-xs font-semibold tracking-widest text-white/40">
                OR
              </span>

              <div className="h-px bg-white/10 flex-1"></div>

            </div>

            {/* =================================================
                SWITCH LOGIN / SIGNUP
            ================================================= */}

            <div className="text-center">

              <p className="text-sm text-white/60">
                {isLoginForm
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </p>

              <button
                onClick={toggleForm}
                className="mt-2 text-sm font-bold text-primary hover:underline underline-offset-4 transition-all duration-200"
              >
                {isLoginForm
                  ? "Create an account →"
                  : "Login to your account →"}
              </button>

            </div>

          </div>

        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <p className="text-center text-xs text-white/40 mt-6">
          Connect • Collaborate • Code
        </p>

      </div>
    </div>
  );
};

export default Login;
