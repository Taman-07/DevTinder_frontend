import { useState } from 'react'
import axios from "axios"
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';


const Login = () => {

  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(false);

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

  const handleSignUp = async() => {
    try{
      const res = await axios.post(BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        {withCredentials: true},
      );
      console.log(res.data.data);
      dispatch(addUser(res.data.data));
      return navigate("/profile");
    }
    catch(err){
      console.log(err.message);
    }
  }


  return (
    <div className="flex justify-center my-10">
      <div className="card card-border bg-base-300 w-96">
        <div className="card-body">
          <h4 className="card-title text-2xl bold flex justify-center">
            {isLoginForm ? "Login" : "Sign Up"}</h4>

          <div>
            {!isLoginForm && (
              <>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">First Name</legend>
              <input
                type="text"
                value={firstName}
                className="input"
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Type here"
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Last Name</legend>
              <input
                type="text"
                value={lastName}
                className="input"
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Type here"
              />
            </fieldset>
            
             </>
            )
            }

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
            <button className="btn btn-primary" onClick={isLoginForm ? handleLogin : handleSignUp}>
              {isLoginForm ? "Login" : "Sign Up"}</button>
          </div>

            <div className="text-center mt-6">
  <button
    onClick={() => setIsLoginForm((value) => !value)}
    className="text-sm px-4 py-2 rounded-full border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black transition-all duration-300"
  >
    {isLoginForm ? "New User? Sign Up" : "Existing User? Login"}
  </button>
</div>
        </div>
      </div>
    </div>
  )
}

export default Login; 