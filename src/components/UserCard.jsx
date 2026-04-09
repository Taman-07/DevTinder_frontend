import React from 'react'

const UserCard = ({ user }) => {
    const { firstName, lastName, about, photoUrl, age, gender } = user;
  return (
    <div className="card w-full max-w-sm bg-base-300 shadow-xl">
  <figure className="px-10 pt-10">
    <img
      src={photoUrl}
      alt="Photo"
      className="rounded-xl" />
  </figure>
  <div className="card-body items-center text-center">
    <h2 className="card-title">{ firstName + " " + lastName }</h2>
    {age && gender && <p>{ age + " , " + gender }</p>}
    <p>{ about }</p>
    <div className="card-actions justify-center my-4">
      <button className="btn btn-primary">Ignore</button>
      <button className="btn btn-secondary">Interested</button>
    </div>
  </div>
</div>
  );
}

export default UserCard