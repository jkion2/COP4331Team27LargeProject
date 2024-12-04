import  { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

function ResetPasswordForm() {
  const { resetToken } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [message, setMessage] = useState('');

  const handleSetPassword = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    setPasswordMatch(value === confirmPassword);
  };

  const handleSetConfirmPassword = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordMatch(value === newPassword);
  };

  async function handleSubmit(event) {
    event.preventDefault();

    if (!passwordMatch) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('https://event-ify/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, newPassword }),
      });

      const res = await response.json();
      if (res.message) {
        setMessage(res.message);
      } else {
        setMessage('Password reset successfully.');
      }
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
      <h2 className='mt-8 text-2xl sm:text-3xl'>Change Your Password</h2>
      <form onSubmit={handleSubmit} className='w-full max-w-sm mt-6'>
        {/* New Password */}
        <div className='relative'>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder='New Password'
            value={newPassword}
            onChange={handleSetPassword}
            className='mb-4 sm:mb-6 h-10 sm:h-12 border border-black/50 rounded-2xl text-lg sm:text-xl px-4 pr-10'
            required
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute inset-y-0 right-3 flex bg-transparent items-center'
            aria-label='Toggle new password visibility'
          >
            {showPassword ? (
              <EyeIcon className='w-5 h-5' />
            ) : (
              <EyeOffIcon className='w-5 h-5' />
            )}
          </button>
        </div>

        {/* Confirm Password */}
        <div className='relative'>
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={handleSetConfirmPassword}
            className='mb-2 sm:mb-4 h-10 sm:h-12 border border-black/50 rounded-2xl text-lg sm:text-xl px-4 pr-10'
            required
          />
          <button
            type='button'
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className='absolute inset-y-0 right-3 bg-transparent flex items-center'
            aria-label='Toggle confirm password visibility'
          >
            {showConfirmPassword ? (
              <EyeIcon className='w-5 h-5' />
            ) : (
              <EyeOffIcon className='w-5 h-5' />
            )}
          </button>
        </div>

        {/* Password Match Message */}
        <p
          className={`text-sm mb-4 ${
            passwordMatch ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {confirmPassword && !passwordMatch ? 'Passwords do not match' : ''}
        </p>

        {/* Submit Button */}
        <Button
          type='submit'
          className='bg-[#CC6C67] hover:bg-[#B74B4B] text-lg sm:text-2xl w-full h-10 sm:h-12 font-normal rounded-2xl'
        >
          Reset Password
        </Button>
      </form>
    </div>
  );
}

export default ResetPasswordForm;
