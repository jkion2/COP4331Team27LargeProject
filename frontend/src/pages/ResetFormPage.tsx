import PromoPhoto from '../components/PromoPhoto.tsx';
import ResetPasswordForm from '@/components/ResetPasswordForm.tsx';

const ResetFormPage = () => {
  return (
    <div className='flex flex-row h-screen w-screen'>
      {/* Login Section */}
      <div className='flex-1 flex items-center justify-center bg-gray-100'>
        <ResetPasswordForm />
      </div>
      {/* PromoPhoto Section */}
      <div className='flex-1 flex items-center justify-center overflow-hidden'>
        <PromoPhoto />
      </div>
    </div>
  );
};

export default ResetFormPage;
