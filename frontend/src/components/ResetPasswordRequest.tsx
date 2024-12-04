import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

function ResetPasswordRequest() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch(
        'https://event-ify/api.xyz/request-password-reset',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );

      const res = await response.json();
      setMessage(res.message);
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  }

  return message ? (
    <div className='flex flex-col items-center justify-center h-screen px-4 sm:px-12'>
      <h1 className='font-modak text-6xl sm:text-7xl md:text-8xl mt-10 sm:mt-16 text-[#98383B]'>
        EVENTIFY
      </h1>
      <p className='mt-8 text-lg sm:text-xl text-center'>{message}</p>
      <Link
        to='/login'
        className='mt-4 bg-[#CC6C67] hover:bg-[#B74B4B] text-white px-6 py-2 text-lg sm:text-xl rounded-2xl'
      >
        Back to Login
      </Link>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center h-screen px-4 sm:px-12'>
      <h1 className='font-modak text-6xl sm:text-7xl md:text-8xl mt-10 sm:mt-16 text-[#98383B]'>
        EVENTIFY
      </h1>
      <h2 className='mt-8 text-2xl sm:text-3xl'>Forgot Your Password?</h2>
      <p className='mt-4 max-w-[32rem] text-base sm:text-lg text-center'>
        Enter your email address. We will send you instructions to reset your
        password if the account exists.
      </p>
      <form onSubmit={handleSubmit} className='w-full max-w-sm mt-6'>
        <Input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='mb-4 sm:mb-6 h-10 sm:h-12 border border-black/50 rounded-2xl text-lg sm:text-xl px-4'
          required
        />
        <Button
          type='submit'
          className='bg-[#CC6C67] hover:bg-[#B74B4B] text-lg sm:text-2xl w-full h-10 sm:h-12 font-normal rounded-2xl'
        >
          Send Email
        </Button>
        <Link
          to='/login'
          className='mt-6 text-[#B74B4B] hover:text-[#6E2D33] text-base sm:text-lg text-center block'
        >
          Back to Login
        </Link>
      </form>
    </div>
  );
}

export default ResetPasswordRequest;
