/* eslint-disable eqeqeq */
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '../icons/Dashboard.icon';
import PlayCircleIcon from '../icons/PlayCircle.icon';
import { Logo } from './Logo.component';

export default function Sidebar(props: { className: string; isLoading: boolean }) {
  return (
    <div className={props.className}>
      <aside className='flex flex-col h-screen p-4 overflow-y-auto bg-white'>
        <div className='flex items-center gap-2'>
          <Logo />
          <h2 className='font-extrabold text-lg text-gray-600'>WYR Stream</h2>
        </div>
        <div className='flex flex-col justify-between flex-1 mt-6'>
          <SidebarNav />
        </div>
      </aside>
    </div>
  );
}

function SidebarNav() {
  return (
    <nav className='flex flex-col gap-2'>
      <SidebarItem icon={<DashboardIcon />} title='Dashboard' path='/' />
      <SidebarItem icon={<PlayCircleIcon />} title='Streams' path='/streams' />
    </nav>
  );
}

function SidebarItem(props: { icon: JSX.Element; title: string; path: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = props.path == '/' ? props.path == location.pathname : location.pathname.includes(props.path);
  return (
    <div
      onClick={() => navigate(props.path)}
      className={
        'flex items-center gap-4 px-4 py-3 text-gray-400 transition-all duration-150 transform rounded-md cursor-pointer hover:bg-slate-100 active:bg-slate-200 font-semibold ' +
        (isActive ? 'bg-slate-200 text-indigo-600 ' : '')
      }
    >
      {props.icon}
      <span>{props.title}</span>
    </div>
  );
}
