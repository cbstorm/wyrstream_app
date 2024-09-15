import _ from 'lodash';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import ErrorMessage from '../components/ErrorMessage.compoment';
import { Input } from '../components/Input.component';
import { Logo } from '../components/Logo.component';
import { ILoginInput } from '../entities/auth.entity';
import SpinnerIcon from '../icons/Spinner.icon';
import authService from '../services/auth.service';
import { APIBuilder, setAccessToken, setRefreshToken } from '../services/base.service';
import { UserState } from '../states/user.state';
import '../styles/auth_page.css';

export default function LoginPage() {
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
  const [loginInput, setLoginInput] = useState<ILoginInput>({ email: '', password: '' });
  const [exception, setException] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [, setUser] = useRecoilState(UserState);
  const handleEmailChange = (email: string) => {
    setException('');
    setLoginInput((prev) => ({ ...prev, email }));
  };
  const handlePasswordChange = (password: string) => {
    setException('');
    setLoginInput((prev) => ({ ...prev, password }));
  };

  const handleSignIn = async () => {
    setIsLoggedIn(true);
    try {
      const apiBuilder = new APIBuilder<ILoginInput>().setBody(loginInput);
      const res = await authService.login(apiBuilder);
      setAccessToken(res.access_token);
      setRefreshToken(res.refresh_token);
      setUser({
        _id: res?._id,
        email: res?.email,
        name: res?.name,
        createdAt: res?.createdAt,
        updatedAt: res?.updatedAt,
      });
      navigate('/');
    } catch (error) {
      setException(_.get(error, 'message', 'Error occurred'));
      console.log('handleSignIn: ', error);
    }
    setIsLoggedIn(false);
  };
  return (
    <div className='login-form flex flex-col gap-4'>
      <div className='flex justify-end items-center gap-2'>
        <span className='text-sm text-gray-600 font-medium'>Don't have an account?</span>
        <button
          onClick={() => navigate('/create_account')}
          className='inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-8 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500'
        >
          Create an account
        </button>
      </div>
      <div className='flex flex-col w-[80%] pt-20 gap-8'>
        <div className='flex flex-col gap-1'>
          <h2 className='font-bold text-3xl text-gray-600'>Log into WYR Stream</h2>
          <span className='font-bold text-sm text-gray-600'>Enter your login details below.</span>
        </div>
        <div className='flex flex-col gap-4'>
          <Input
            label='EMAIL ADDRESS'
            name='email'
            placeholder='Email address'
            value={loginInput.email}
            onChange={(value) => handleEmailChange(value as string)}
          />
          <div className='flex flex-col'>
            <Input
              label='PASSWORD'
              name='password'
              placeholder='Password'
              value={loginInput.password}
              password
              onChange={(value) => handlePasswordChange(value as string)}
            />
            <div className='flex justify-end mt-1'>
              <span className='text-sm font-bold cursor-pointer underline text-gray-600 hover:opacity-60 transition-all duration-150'>
                Forgot your password?
              </span>
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <button
              onClick={handleSignIn}
              disabled={!loginInput.email || !loginInput.password || isLoggedIn}
              className='bg-gray-800 px-6 py-3 text-white font-bold rounded-md border-[1px] border-gray-200 hover:bg-white hover:border-gray-800 hover:text-gray-800 disabled:bg-opacity-30 disabled:hover:bg-gray-400 disabled:hover:border-none disabled:hover:text-white disabled:border-none transition-all duration-150 flex justify-center max-w-max'
            >
              {!isLoggedIn && <span>SIGN IN</span>}
              {isLoggedIn && <SpinnerIcon className='animate-spin w-6 h-6 text-indigo-600' />}
            </button>
            {!!exception && <ErrorMessage message={exception} />}
          </div>
        </div>
      </div>
    </div>
  );
}
