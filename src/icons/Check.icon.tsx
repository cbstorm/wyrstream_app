import { IIconProps } from './common';

export default function CheckIcon(props: IIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth='3'
      stroke='currentColor'
      className={props.className || 'w-6 h-6'}
    >
      <path strokeLinecap='round' strokeLinejoin='round' d='m4.5 12.75 6 6 9-13.5' />
    </svg>
  );
}
