/* eslint-disable eqeqeq */
import { useState } from 'react';

export default function Select(props: {
  label?: string;
  value: string;
  name: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [showOpts, setShowOpts] = useState(false);
  return (
    <div className='w-full flex flex-col gap-1'>
      {props.label && <label className='block text-xs font-semibold text-gray-600'>{props.label}</label>}
      <div className='relative'>
        <div
          className={
            'h-10  flex border border-gray-200 rounded items-center ' + (props.disabled ? 'bg-gray-100 ' : ' bg-white ')
          }
        >
          <input
            placeholder={props.placeholder}
            value={props.options.find((e) => e.value == props.value)?.label || ''}
            name={props.name}
            className={'px-4 appearance-none outline-none text-gray-800 w-full caret-transparent cursor-pointer disabled:bg-gray-100 text-sm '}
            checked
            onChange={() => {}}
            onFocus={() => setShowOpts(true)}
            onBlur={() => setShowOpts(false)}
            autoComplete='off'
            disabled={props.disabled}
          />
          <button
            disabled={props.disabled}
            onClick={() => setShowOpts((prev) => !prev)}
            className='cursor-pointer outline-none focus:outline-none border-l border-gray-200 transition-all text-gray-300 hover:text-gray-600'
          >
            <svg
              className={'w-4 h-4 mx-2 fill-current transition-all duration-100 ' + (showOpts ? 'rotate-180' : '')}
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <polyline points='18 15 12 9 6 15'></polyline>
            </svg>
          </button>
        </div>

        <input type='checkbox' name='show_more' id='show_more' className='hidden peer' checked onChange={() => {}} />
        <div
          className={
            'absolute rounded shadow bg-white overflow-hidden hidden peer-checked:flex flex-col w-full mt-1 border border-gray-200 z-50 transition-all duration-100 max-h-select overflow-y-auto ' +
            (showOpts ? '' : 'opacity-0 invisible')
          }
        >
          {props.options.map((e, idx) => {
            return (
              <Option
                key={idx}
                choosen={props.value == e.value}
                label={e.label}
                onChoose={() => props.onChange(e.value)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Option(props: { choosen: boolean; label: string; onChoose: () => void }) {
  return (
    <div onClick={() => props.onChoose()} className='cursor-pointer group'>
      <span
        className={
          'block p-2 border-transparent border-l-4 group-hover:border-indigo-500 group-hover:bg-indigo-100 text-sm font-medium ' +
          (props.choosen ? ' border-l-4 border-indigo-600  bg-indigo-100 ' : '')
        }
      >
        {props.label}
      </span>
    </div>
  );
}
