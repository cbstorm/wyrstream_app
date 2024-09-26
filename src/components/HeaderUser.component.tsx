import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { IUser } from '../entities/user.enity';
import LogoutIcon from '../icons/Logout.icon';
import UserIcon from '../icons/User.icon';
import { clearTokens } from '../services/base.service';
import { UserState, userStateDefault } from '../states/user.state';
import Avatar from './Avatar.component';

export default function HeaderUser(props: { isLoading: boolean }) {
  const navigate = useNavigate();
  const [user, setUser] = useRecoilState(UserState);
  const handleLogout = () => {
    setUser(userStateDefault);
    clearTokens();
    navigate('/login');
  };
  if (props.isLoading) {
    return <HeaderUserSekeleton />;
  }
  if (user._id && user.name) {
    return (
      <div className='flex gap-2'>
        <LoggedInUserHeader user={user} onClick={() => navigate('/console')} />
        <button
          onClick={() => handleLogout()}
          className='fade-in flex gap-2 items-center px-4 py-1 text-gray-600 transition-colors duration-100 transform rounded-md cursor-pointer hover:bg-slate-100 border border-rose-800'
        >
          <LogoutIcon className='w-6 h-6 text-rose-800' />
          <span className='text-xs text-rose-800 font-semibold'>Logout</span>
        </button>
      </div>
    );
  }
  return <UnLoggedInUserHeader onClick={() => navigate('/login')} />;
}

function LoggedInUserHeader(props: { user: IUser; onClick: () => void }) {
  return (
    <div
      onClick={() => props.onClick()}
      className='fade-in flex gap-2 items-center px-4 py-1 text-gray-600 transition-colors duration-100 transform rounded-md cursor-pointer hover:bg-slate-100'
    >
      <Avatar src={props.user.avatarUrl} className='w-12 h-12 rounded-full overflow-hidden' />
      <div className='flex flex-col w-40 truncate'>
        <span className='font-bold text-gray-800 truncate'>{props.user.name}</span>
        <span className='font-semibold text-xs text-gray-600 truncate'>{props.user.email}</span>
      </div>
    </div>
  );
}

function UnLoggedInUserHeader(props: { onClick: () => void }) {
  return (
    <div
      onClick={() => props.onClick()}
      className='fade-in border border-indigo-200 flex gap-6 justify-center items-center px-8 py-1 transition-colors duration-300 transform rounded-md cursor-pointer bg-slate-50 hover:bg-slate-100'
    >
      <div className='border-indigo-800 border rounded-full p-1'>
        <UserIcon className='text-indigo-800 w-6 h-6' />
      </div>
      <div className='truncate'>
        <span className='font-bold text-indigo-800 truncate'>Login</span>
      </div>
    </div>
  );
}

function HeaderUserSekeleton() {
  return (
    <div className='flex gap-2 items-center px-4 py-2'>
      <div className='rounded-full h-9 w-9 flex-shrink-0 bg-slate-300 animate-pulse'></div>
      <div className='flex flex-col w-40 gap-1'>
        <div className='h-4 w-32 bg-slate-300 animate-pulse rounded-md'></div>
        <div className='h-3 w-32 bg-slate-300 animate-pulse rounded-lg'></div>
      </div>
    </div>
  );
}
