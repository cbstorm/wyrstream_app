import HeaderUser from './HeaderUser.component';
import NotificationButton from './NotificationButton.component';
import SearchBox from './SearchBox.component';

export default function Header(props: { isLoading: boolean }) {
  return (
    <div className='fade-in fixed w-full flex z-10'>
      <div className='w-1/6 opacity-0'></div>
      <div className='w-5/6 flex items-center gap-2 justify-between bg-white px-6 py-2'>
        <SearchBox isLoading={props.isLoading} />
        <div className='flex items-center gap-2'>
          <NotificationButton isLoading={props.isLoading} />
          <HeaderUser isLoading={props.isLoading} />
        </div>
      </div>
    </div>
  );
}
