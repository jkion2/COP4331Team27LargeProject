import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

function Login() {
  const [message, setMessage] = useState('');
  const [loginEmail, setLoginEmail] = React.useState('');
  const [loginPassword, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

  async function doLogin(event: any): Promise<void> {
    event.preventDefault();
    const obj = { email: loginEmail, password: loginPassword };
    const js = JSON.stringify(obj);

    try {
      const response = await fetch('http://localhost:3000/api/login', {
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
    <div className='flex flex-col items-center justify-center gap-2 px-4 sm:px-12 md:px-24'>
      <div className='font-modak text-6xl sm:text-7xl md:text-8xl mt-10 sm:mt-16 text-[#98383B]'>
        EVENTIFY
      </div>
      <h1 className='mb-4 sm:mb-6 text-2xl sm:text-3xl'>Login</h1>
      <h2 className='mb-4 sm:mb-6 text-center text-base sm:text-lg'>
        Don't have an account?{' '}
        <Link
          to='/'
          className='text-[#B74B4B] hover:text-[#6E2D33] cursor-pointer'
        >
          Sign up
        </Link>
      </h2>
      <form onSubmit={doLogin} className='w-full max-w-sm'>
        <Input
          type='email'
          placeholder='Email'
          value={loginEmail}
          onChange={handleSetLoginEmail}
          className='mb-4 sm:mb-6 h-10 sm:h-12 border border-black/50 rounded-2xl text-lg sm:text-xl px-4'
          required
        />
        <div className='relative'>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            value={loginPassword}
            onChange={handleSetPassword}
            className='mb-4 h-10 sm:h-12 border border-black/50 rounded-2xl text-lg sm:text-xl px-4 pr-10'
            required
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute inset-y-0 right-3 flex bg-transparent items-center'
            aria-label='Toggle password visibility'
          >
            {showPassword ? (
              <EyeIcon className='w-5 h-5' />
            ) : (
              <EyeOffIcon className='w-5 h-5' />
            )}
          </button>
        </div>
        <h2 className='mb-6 text-sm sm:text-base text-[#B74B4B] text-center'>
          Forgot password?
        </h2>
        <Button
          type='submit'
          className='bg-[#CC6C67] hover:bg-[#B74B4B] text-lg sm:text-2xl w-full h-10 sm:h-12 font-normal rounded-2xl'
        >
          Login
        </Button>
      </form>
      {message && (
        <p className='mt-4 text-sm sm:text-base text-red-600'>{message}</p>
      )}
    </div>
  );
}

export default Login;
