import { useState } from 'react'
import axios from "axios"
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';


const Login = () => {

  const [emailId, setEmailId] = useState("ASharma@gmail.com");
  const [password, setPassword] = useState("AnushkaSharma@123");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleLogin = async() =>{
    try{
      const res = await axios.post(BASE_URL + "/login", {
        emailId,
        password,
      },
    {withCredentials: true}
    );
    dispatch(addUser(res.data));
    return navigate("/");
    }
    catch(err){
      setError(err?.response?.data || "Something went Wrong !!");
    }
  }


  return (
    <div className="flex justify-center my-10">
      <div className="card card-border bg-base-300 w-96">
        <div className="card-body">
          <h4 className="card-title text-2xl bold flex justify-center">Login</h4>

          <div>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email ID</legend>
              <input
                type="text"
                value={emailId}
                className="input"
                onChange={(e) => setEmailId(e.target.value)}
                placeholder="Type here"
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Password</legend>
              <input
                type="password"
                value={password}
                className="input"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Type here"
              />
            </fieldset>
          </div>

          <p className='text-red-500'>{ error }</p>

          <div className="card-actions justify-center">
            <button className="btn btn-primary" onClick={handleLogin}>Login</button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Login; 