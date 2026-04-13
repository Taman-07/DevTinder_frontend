import React from 'react';
import { useSelector  } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';
import axios from "axios";
import { useDispatch } from 'react-redux';
import { removeUser } from '../utils/userSlice';


const Navbar = () => {
  const user = useSelector(store=> store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try{
        await axios.post(
        BASE_URL + "/logout", 
        {}, 
        {withCredentials: true}),

        dispatch(removeUser());
        return navigate("/login");
    }
    catch(err){
      console.log(err.message);
    }
  };

  return (
    <div className="navbar bg-neutral text-neutral-content"> 

        <div className="navbar-start">
          <Link to="/" className="btn btn-ghost text-xl">😊 Dev Tinder </Link>
       </div>

    {user && (
      <div className="navbar-end flex items-center gap-3">

      <p className="font-semibold mr-2">
        Welcome, {user.firstName}
      </p>

    <div className="dropdown dropdown-end mx-5 flex">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">

        <div className="w-10 rounded-full">
          <img
            alt="User photo"
            src={user.photoUrl} />
        </div>
      </div>


      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li>
          <Link to='/profile' className="justify-between">
            Profile
            <span className="badge">New</span>
          </Link>
        </li>
        <li>
          <Link to="/connections">Connections</Link>
          </li>
          
        <li>
          <Link to="/requests">Requests</Link>
        </li>

        <li><a onClick={handleLogout}>Logout</a></li>
      </ul>
    </div>
    </div>
    )}

  </div>
  )
}

export default Navbar