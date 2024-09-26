import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import UserIcon from '../icons/User.icon';
import { UserState } from '../states/user.state';
import Avatar from './Avatar.component';

export default function HeaderUser(props: { isLoading: boolean }) {
  const navigate = useNavigate();
  const [user] = useRecoilState(UserState);
  if (props.isLoading) {
    return <HeaderUserSekeleton />;
  }
  if (user._id && user.name) {
    return (
      <div
        onClick={() => navigate('/console')}
        className='fade-in flex gap-2 items-center px-4 py-1 text-gray-600 transition-colors duration-300 transform rounded-md cursor-pointer hover:bg-slate-100'
      >
        <Avatar src={user.avatarUrl} className='w-12 h-12 rounded-full overflow-hidden' />
        <div className='flex flex-col w-40 truncate'>
          <span className='font-bold text-gray-800 truncate'>{user.name}</span>
          <span className='font-semibold text-xs text-gray-600 truncate'>{user.email}</span>
        </div>
      </div>
    );
  }
  return <UnLoggedInUserHeader onClick={() => navigate('/login')} />;
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
