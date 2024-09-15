import { IIconProps } from './common';

export default function PingPointIcon(props: IIconProps) {
  return (
    <span className={props.className}>
      <span className='relative flex h-3 w-3'>
        <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75'></span>
        <span className='relative inline-flex rounded-full h-3 w-3 bg-indigo-500'></span>
      </span>
    </span>
  );
}
