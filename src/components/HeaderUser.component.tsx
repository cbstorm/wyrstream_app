import { useRecoilState } from 'recoil';
import { UserState } from '../states/user.state';

export default function HeaderUser(props: { isLoading: boolean }) {
  const [user] = useRecoilState(UserState);
  if (props.isLoading) {
    return <HeaderUserSekeleton />;
  }

  return (
    <div className='fade-in flex gap-2 items-center px-4 py-1 text-gray-600 transition-colors duration-300 transform rounded-md cursor-pointer hover:bg-slate-100'>
      <img
        className='object-cover rounded-full h-9 w-9 flex-shrink-0'
        src='https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
        alt='avatar'
      />
      <div className='flex flex-col w-40 truncate'>
        <span className='font-bold text-gray-800 truncate'>{user.name}</span>
        <span className='font-semibold text-xs text-gray-600 truncate'>{user.email}</span>
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
