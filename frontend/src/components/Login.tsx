import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

function Login() {
  const [message, setMessage] = useState('');
  const [loginEmail, setLoginEmail] = React.useState(''); // Renamed for email
  const [loginPassword, setPassword] = React.useState('');

  async function doLogin(event: any): Promise<void> {
    event.preventDefault();
    const obj = { email: loginEmail, password: loginPassword }; // Use email instead of login
    const js = JSON.stringify(obj);

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' },
      });

      const res = JSON.parse(await response.text());

      if (!res.user) {
        setMessage('Email/Password combination incorrect');
      } else {
        localStorage.setItem('user_data', JSON.stringify(res.user));

        setMessage('');
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      alert(error.toString());
      return;
    }
  }

  function handleSetLoginEmail(e: any): void {
    setLoginEmail(e.target.value);
  }

  function handleSetPassword(e: any): void {
    setPassword(e.target.value);
  }

  return (
    <div className='flex flex-col items-center justify-center gap-2 px-48 '>
      <div className='font-modak text-8xl mt-20 text-[#98383B]'>EVENTIFY</div>
      <h1 className='mb-6'>Login</h1>
      <h2 className='mb-6'>
        Don't have an account?{' '}
        <Link
          to='/'
          className='text-[#B74B4B] hover:text-[#6E2D33] cursor-pointer'
        >
          Sign up
        </Link>
      </h2>
      <form onSubmit={doLogin} className='w-full'>
        <Input
          type='email' // Changed to email
          placeholder='Email'
          value={loginEmail}
          onChange={handleSetLoginEmail}
          className='mb-6 h-12 border border-black/50 rounded-2xl text-xl'
          required
        />
        <Input
          type='password'
          placeholder='Password'
          value={loginPassword}
          onChange={handleSetPassword}
          className='mb-4 h-12 border border-black/50 rounded-2xl text-xl'
          required
        />
        <h2 className='mb-8 text-[#B74B4B]'>Forgot password?</h2>
        <Button
          type='submit'
          className='bg-[#CC6C67] hover:bg-[#B74B4B] text-2xl w-full h-12 font-normal rounded-2xl'
        >
          Login
        </Button>
      </form>
      {message && <p className='mt-4 text-red-600'>{message}</p>}
    </div>
  );
}

export default Login;
