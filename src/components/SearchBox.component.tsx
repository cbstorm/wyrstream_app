import SearchIcon from '../icons/Search.icon';

export default function SearchBox(props: { isLoading: boolean }) {
  if (props.isLoading) {
    return <SearchBoxSkeleton />;
  }
  return (
    <div className='relative w-[60%]'>
      <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
        <SearchIcon />
      </span>
      <input
        type='text'
        className='w-full py-2 pl-10 pr-4 text-gray-600 bg-slate-100 focus:border-[1px] focus:border-gray-300 focus:bg-white rounded-lg transition-all duration-100'
        placeholder='Search'
        disabled={true}
      />
    </div>
  );
}

function SearchBoxSkeleton() {
  return <div className='h-9 w-[60%] bg-slate-300 animate-pulse rounded-lg'></div>;
}
