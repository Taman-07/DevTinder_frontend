import React from 'react';
import { useSelector  } from 'react-redux';
import { Link } from 'react-router-dom';


const Navbar = () => {
  const user = useSelector(store=> store.user);
  console.log(user);

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
      <div tabIndex={-1} role="button" className="btn btn-ghost btn-circle avatar">

        <div className="w-10 rounded-full">
          <img
            alt="User photo"
            src={user.photoUrl} />
        </div>
      </div>


      <ul
        tabIndex="-1"
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li>
          <Link to='/profile' className="justify-between">
            Profile
            <span className="badge">New</span>
          </Link>
        </li>
        <li><a>Settings</a></li>
        <li><a>Logout</a></li>
      </ul>
    </div>
    </div>
    )}

  </div>
  )
}

export default Navbar