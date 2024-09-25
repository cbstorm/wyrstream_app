/* eslint-disable eqeqeq */
import _ from 'lodash';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage.compoment';
import { Input } from '../components/Input.component';
import { Logo } from '../components/Logo.component';
import { ICreateAccountInput } from '../entities/auth.entity';
import ArrowLeftIcon from '../icons/ArrowLeft.icon';
import SpinnerIcon from '../icons/Spinner.icon';
import authService from '../services/auth.service';
import { APIBuilder } from '../services/base.service';
import '../styles/auth_page.css';

export default function CreateAccountPage() {
  return (
    <div className='h-screen w-screen bg-gradient-to-r from-blue-600 to-violet-600 flex justify-center items-center'>
      <div className='fade-in h-[80%] w-[60%] flex shadow-2xl rounded-xl'>
        <div className='h-full bg-gray-900 w-[40%] bg-opacity-20 rounded-tl-xl rounded-bl-xl flex justify-center items-center'>
          <LeftSide />
        </div>
        <div className='h-full bg-slate-100 w-[60%] rounded-tr-xl rounded-br-xl px-6 py-4'>
          <RightSide />
        </div>
      </div>
    </div>
  );
}

export function LeftSide() {
  return (
    <div className='flex flex-col gap-2 items-center px-2'>
      <div className='flex flex-col gap-4 items-center'>
        <Logo />
        <div className='flex flex-col gap-3 items-center'>
          <h2 className='font-extrabold text-3xl text-white'>WRY Stream</h2>
          <h3 className='text-slate-100 text-lg'>Video streaming System</h3>
        </div>
        <h3 className='text-slate-300 text-center'>Your world, your stream, your vibe.</h3>
      </div>
    </div>
  );
}

export function RightSide() {
  const navigate = useNavigate();
  const [createAccountInput, setCreateAccountInput] = useState<ICreateAccountInput>({} as ICreateAccountInput);
  const [exception, setException] = useState<string>('');
  const [isPending, setIsPending] = useState(false);
  const handleNameChange = (name: string) => {
    setException('');
    setCreateAccountInput((prev) => ({ ...prev, name }));
  };
  const handleEmailChange = (email: string) => {
    setException('');
    setCreateAccountInput((prev) => ({ ...prev, email }));
  };
  const handlePasswordChange = (password: string) => {
    setException('');
    setCreateAccountInput((prev) => ({ ...prev, password }));
  };
  const handleConfirmPasswordChange = (confirmPassword: string) => {
    setException('');
    setCreateAccountInput((prev) => ({ ...prev, confirmPassword }));
  };
  const isDisableSubmitButton = () => {
    return (
      !createAccountInput.name ||
      !createAccountInput.email ||
      !createAccountInput.password ||
      !createAccountInput.confirmPassword ||
      isPending
    );
  };

  const handleCreateAccount = async () => {
    if (createAccountInput.password != createAccountInput.confirmPassword) {
      setException('Confirm password does not match');
      return;
    }
    setIsPending(true);
    try {
      const apiBuilder = new APIBuilder<ICreateAccountInput>().setBody(createAccountInput);
      await authService.CreateAccount(apiBuilder);
      navigate('/login');
    } catch (error) {
      setException(_.get(error, 'message', 'Error occurred'));
      console.log('handleSignIn: ', error);
    }
    setIsPending(false);
  };
  return (
    <div className='create-account-form flex flex-col gap-4'>
      <div className='flex justify-start items-center gap-2'>
        <button
          onClick={() => navigate('/login')}
          className='flex items-center justify-between gap-1 shrink-0 rounded-md border border-blue-600 bg-blue-600 px-8 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500'
        >
          <ArrowLeftIcon />
          <span>Back to Login</span>
        </button>
      </div>
      <div className='flex flex-col w-[80%] pt-20 gap-8'>
        <div className='flex flex-col gap-1'>
          <h2 className='font-bold text-3xl text-gray-600'>Welcome new member!</h2>
          <span className='font-bold text-sm text-gray-600'>Enter your account details below.</span>
        </div>
        <div className='flex flex-col gap-4'>
          <Input
            label='YOUR NAME'
            name='name'
            placeholder='Your name'
            value={createAccountInput.name}
            onChange={(value) => handleNameChange(value as string)}
          />
          <Input
            label='EMAIL ADDRESS'
            name='email'
            placeholder='Email address'
            value={createAccountInput.email}
            onChange={(value) => handleEmailChange(value as string)}
          />
          <Input
            label='PASSWORD'
            name='password'
            placeholder='Password'
            value={createAccountInput.password}
            password
            onChange={(value) => handlePasswordChange(value as string)}
          />
          <Input
            label='CONFIRM PASSWORD'
            name='confirmPassword'
            placeholder='Confirm password'
            value={createAccountInput.confirmPassword}
            password
            onChange={(value) => handleConfirmPasswordChange(value as string)}
          />

          <div className='flex flex-col gap-2'>
            <button
              onClick={handleCreateAccount}
              disabled={isDisableSubmitButton()}
              className='bg-gray-800 px-6 py-3 text-white font-bold rounded-md border-[1px] border-gray-200 hover:bg-white hover:border-gray-800 hover:text-gray-800 disabled:bg-opacity-30 disabled:hover:bg-gray-400 disabled:hover:border-none disabled:hover:text-white disabled:border-none transition-all duration-150 flex justify-center max-w-max'
            >
              {!isPending && <span>CREATE</span>}
              {isPending && <SpinnerIcon className='animate-spin w-6 h-6 text-indigo-600' />}
            </button>
            {!!exception && <ErrorMessage message={exception} />}
          </div>
        </div>
      </div>
    </div>
  );
}
