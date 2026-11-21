import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import Brand from "./Brand";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAlumni = user?.role === "alumni";

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.log(err.message);
    }
  };

  // closes the dropdown after clicking an item
  const closeMenu = () => {
    if (document.activeElement) document.activeElement.blur();
  };

  // links shown in the bar (desktop) and in the dropdown (mobile)
  const links = [
    ...(isAlumni ? [] : [{ to: "/", label: "Mentors", end: true }]),
    { to: "/connections", label: "Connections" },
    { to: "/requests", label: "Requests" },
  ];

  const navLinkClass = ({ isActive }) =>
    "px-4 h-10 inline-flex items-center rounded-xl text-sm font-medium transition-colors " +
    (isActive
      ? "text-white bg-primary/25"
      : "text-base-content/70 hover:text-base-content hover:bg-white/5");

  return (
    <header className="sticky top-0 z-40 bg-[#1a0d11]/90 backdrop-blur border-b border-primary/20">
      {/* full width: brand at the far left, profile at the far right */}
      <div className="w-full flex items-center justify-between gap-4 px-4 sm:px-8 h-16">
        {/* LEFT: BRAND */}
        <Link to="/" className="shrink-0" aria-label="Alumni-Bridge home">
          <Brand />
        </Link>

        {/* CENTER: LINKS (desktop only) */}
        {user && (
          <nav className="hidden md:flex items-center gap-1" aria-label="Main">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={navLinkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>
        )}

        {/* RIGHT: USER AREA */}
        <div className="shrink-0 flex items-center justify-end gap-3">
          {user ? (
            <>
              <div className="hidden sm:block text-right leading-tight">
                <p className="text-sm font-semibold">Hello, {user.firstName}</p>
                <p className="text-xs text-base-content/60">
                  {isAlumni ? "Alumnus" : "Student"}
                </p>
              </div>

              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  aria-label="Open menu"
                  className="btn btn-ghost btn-circle avatar ring-2 ring-primary/70 ring-offset-2 ring-offset-[#1a0d11]"
                >
                  <div className="w-10 rounded-full">
                    <img alt="Your profile" src={user.photoUrl} />
                  </div>
                </div>

                <ul
                  tabIndex={0}
                  className="menu dropdown-content bg-base-200 border border-white/10 rounded-2xl z-50 mt-4 w-56 p-2 shadow-2xl"
                >
                  {/* name (mobile, since the name is hidden in the bar) */}
                  <li className="sm:hidden px-3 py-2 pointer-events-none">
                    <span className="flex flex-col items-start gap-0 p-0">
                      <span className="text-sm font-semibold">
                        Hello, {user.firstName}
                      </span>
                      <span className="text-xs text-base-content/50">
                        {isAlumni ? "Alumnus" : "Student"}
                      </span>
                    </span>
                  </li>

                  <li>
                    <Link
                      to="/profile"
                      onClick={closeMenu}
                      className="rounded-xl py-3 text-sm font-medium"
                    >
                      Profile
                    </Link>
                  </li>

                  <li>
                    <a
                      onClick={() => {
                        closeMenu();
                        handleLogout();
                      }}
                      className="rounded-xl py-3 text-sm font-medium text-error hover:bg-error/10"
                    >
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm h-10 rounded-xl px-5">
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;