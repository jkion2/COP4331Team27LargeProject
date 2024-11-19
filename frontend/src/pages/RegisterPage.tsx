import PromoPhoto from '../components/PromoPhoto.tsx';
import Register from '../components/Register.tsx';

const RegisterPage = () => {
  return (
    <div className='flex flex-row h-screen w-screen'>
      <div className='flex-1'>
        <Register />
      </div>
      <div className='flex-1'>
        <PromoPhoto />
      </div>
    </div>
  );
};

export default RegisterPage;
