import NotificationIcon from '../icons/Notification.icon';
import PingPointIcon from '../icons/PingPoint.icon';

export default function NotificationButton(props: { isLoading: boolean }) {
  if (props.isLoading) {
    return <NotificationButtonSkeleton />;
  }
  return (
    <div className='fade-in flex items-center'>
      <button className='relative bg-slate-100 p-2 rounded-md hover:bg-slate-200 transition-all duration-100'>
        <NotificationIcon className='text-indigo-800 w-6 h-6' />
        <PingPointIcon className='absolute top-[-3px] right-[-3px]' />
      </button>
    </div>
  );
}

function NotificationButtonSkeleton() {
  return <div className='w-9 h-9 animate-pulse rounded-md bg-slate-300'></div>;
}
