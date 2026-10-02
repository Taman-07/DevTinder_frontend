import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const navLinkClass = ({ isActive }) =>
    "px-3 py-2 rounded-xl text-base font-semibold transition-all duration-200 " +
    (isActive
      ? "text-primary bg-primary/10"
      : "text-base-content/70 hover:text-base-content hover:bg-white/10");

  return (
    <div className="sticky top-0 z-40 bg-base-300/80 backdrop-blur border-b border-white/10 px-4 sm:px-6 py-2">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center">
        {/* LEFT: BRAND */}
        <div className="flex items-center justify-start">
          <Link to="/" className="text-2xl font-black tracking-tight">
            Pair
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {" "}
              Up
            </span>
          </Link>
        </div>

        {/* CENTER: NAV LINKS */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {user && (
            <>
              <NavLink to="/connections" className={navLinkClass}>
                Connections
              </NavLink>
              <NavLink to="/requests" className={navLinkClass}>
                Requests
              </NavLink>
            </>
          )}
        </nav>

        {/* RIGHT: USER AREA */}
        <div className="flex items-center justify-end gap-4">
          {user && (
            <>
              <div className="hidden md:block text-right leading-tight">
                  <p className="text-xs font-medium text-base-content/60">
                    Hello 👋
                  </p>
                  <p className="text-base font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {user.firstName}
                  </p>
              </div>

              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar ring-2 ring-primary/60 ring-offset-2 ring-offset-base-300"
                >
                  <div className="w-10 rounded-full">
                    <img alt="User photo" src={user.photoUrl} />
                  </div>
                </div>

                <ul
                  tabIndex={0}
                  className="menu dropdown-content bg-base-200 border border-white/10 rounded-2xl z-50 mt-4 w-52 p-2 shadow-2xl"
                >
                  <li>
                    <Link
                      to="/profile"
                      onClick={closeMenu}
                      className="rounded-xl py-3 text-base font-semibold"
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
                      className="rounded-xl py-3 text-base font-semibold text-red-400 hover:bg-red-500/10"
                    >
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;