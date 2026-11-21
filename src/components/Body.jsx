import { Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect, useState } from "react";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((store) => store.user);
  const [checking, setChecking] = useState(!userData);

  const fetchUser = async () => {
    if (userData) {
      setChecking(false);
      return;
    }
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (err) {
      // only redirect if we are not already on the login page
      if (err.response?.status === 401 && location.pathname !== "/login") {
        navigate("/login");
      }
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-base-100">
      <NavBar />
      <main className="flex-1">
        {checking ? (
          <div className="min-h-[50dvh] flex items-center justify-center">
            <span className="loading loading-spinner loading-md text-primary" />
          </div>
        ) : (
          <Outlet />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Body;