import React, { useState } from "react";
import axios from "axios";
import useSWR, { mutate } from "swr";
interface User {
  id?: number ;
  username: string;
  age: number;
}

export default function App() {
  const fetcher = (...args: [any]) =>
    fetch(...args, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

  const [username, set_username] = useState<string>("");
  const [age, set_age] = useState<number>(0);
  const [new_username, set_new] = useState<string>("");

  const {data: users, error} = useSWR("http://127.0.0.1:8000/api/users/", fetcher)

  const add_user = async () =>{
    const user: User = {
      username,
      age
    };
    try {
      await axios.post("http://127.0.0.1:8000/api/users/create", user);
      mutate("http://127.0.0.1:8000/api/users/");
      
    } catch (error) {
      console.log(error);
    }
};

  const update = async (id:number, age: number) =>{
    const new_data = {
      username: new_username,
      age
    };
    try {
      await axios.put(`http://127.0.0.1:8000/api/users/${id}`, new_data);
      mutate("http://127.0.0.1:8000/api/users/");
    } catch (error) {
      console.log(error);
    }
  };

  const delete_user = async (id:number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/users/${id}`);
      mutate("http://127.0.0.1:8000/api/users/");
    } catch (error) {
      console.log(error);
    }

  };

  return (
    <div>
      <h1>User CRUD</h1>
      <input
        name="username"
        type="text"
        value={username}
        onChange={(e) => set_username(e.target.value)}
        placeholder="User name..."
      />
      <input
        type="number"
        name="age"
        value={age}
        onChange={(e) => set_age(e.target.valueAsNumber)}
        placeholder="User age..."
      />

      <button onClick={add_user}>Add User</button>

      <div>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Username</th>
              <th>Age</th>
              <th>Change username</th> 
              <th>Action</th> 
            </tr>
          </thead>
          <tbody>
            {
              users ? users.map((user:User) =>{
                return <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.age}</td>
                  <td>
                    <input type="text" name="new_title" onChange={e => set_new(e.target.value)} />
                    <button onClick={() =>update(user.id,user.age)}>Change</button>
                  </td>
                  <td>
                    <button onClick={() => delete_user(user.id)}>Delete</button>
                  </td>
                </tr>
              }):""
            }
          </tbody>
        </table>
        
      </div>
    </div>
  );
}
