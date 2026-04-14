import React from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from 'react-redux';
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, about, photoUrl, age, gender } = user;

  const dispatch = useDispatch();

  const handleSendRequest = async(status, _id) => {
    try{
      const res = await axios.post(BASE_URL + "/request/send/" + status + "/" + _id,
        {},
        {withCredentials: true},
      );
      dispatch(removeUserFromFeed(_id));
    }
    catch(err){
      console.log(err.message);
    }
  };


  return (
    <div className="flex justify-center">
      <div className="card w-80 bg-base-200 shadow-2xl rounded-2xl overflow-hidden hover:scale-105 transition duration-300">
        <figure className="bg-black">
          <img src={photoUrl} alt="user" className="w-full max-h-[400px] object-contain"/>
        </figure>

        <div className="card-body items-center text-center">
          <h2 className="card-title text-xl font-bold">{firstName} {lastName}</h2>

          {age && gender && (
            <p className="text-sm opacity-70">
              {age} • {gender}
            </p>
          )}

          <p className="text-sm mt-2">{about}</p>

          <div className="card-actions justify-center gap-4 mt-4">

            <button className="btn btn-outline btn-error" 
              onClick={() => handleSendRequest("ignored", _id)}>Ignore</button>

            <button className="btn btn-outline btn-primary"
              onClick={() => handleSendRequest("interested", _id)}>Interested</button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;