"use client"
import React from 'react'
import axios from 'axios';
const RegisterPage = () => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
const registerUser = async () => {
    if (username && password) {
        try {
            const response = await axios.post('http://localhost:8080/register', {
                username,
                password
            });

            console.log(response.data);
        } catch (error : any) {
            console.error(error.response?.data || error.message);
        }
    }
};
  return (
    <div className='flex flex-col max-w-lg gap-2'>
        <input type="text" placeholder='Enter your username' className='p-2' onChange={(e)=>setUsername(e.target.value)}/>
                <input type="text" placeholder='Enter your password' className='p-2' onChange={(e) => setPassword(e.target.value)} />
                <button onClick={registerUser}>Register</button>
      
    </div>
  )
}

export default RegisterPage;
