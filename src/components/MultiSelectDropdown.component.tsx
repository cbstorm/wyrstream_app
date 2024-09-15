/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
import CloseIcon from '../icons/Close.icon';

/* eslint-disable eqeqeq */
export default function MultiSelectDropdown(props: {
  selectedValues: string[];
  selectedLabels: string[];
  placeholder?: string;
  options: { value: string; label: string }[];
  onChange: (selected: string[]) => void;
  onSearch?: (search: string) => void;
}) {
  const [showOption, setShowOption] = useState(false);
  const handleChoose = (value: string) => {
    if (props.selectedValues.includes(value)) {
      props.onChange(props.selectedValues.filter((e) => e != value));
      return;
    }
    props.onChange(props.selectedValues.concat([value]));
  };
  const handleRemove = (value: string) => {
    props.onChange(props.selectedValues.filter((e) => e != value));
  };

  return (
    <div className='w-full flex flex-col items-center h-32 mx-auto'>
      <div className='w-full'>
        <div className='flex flex-col items-center relative'>
          <div className='w-full'>
            <div className='my-2 p-1 flex border border-gray-200 bg-white rounded'>
              <div className='multi-select py-1 flex flex-auto gap-1 overflow-x-auto'>
                {props.selectedValues.map((e, idx) => {
                  return (
                    <SelectedItem
                      key={idx}
                      onRemove={() => handleRemove(e)}
                      value={e}
                      label={props.selectedLabels[idx] as string}
                    />
                  );
                })}
                <div className='flex-1'>
                  <input
                    placeholder={!props.selectedValues?.length ? props.placeholder : ''}
                    className='bg-transparent p-1 px-2 appearance-none outline-none h-full w-full text-gray-800'
                    onFocus={() => setShowOption(true)}
                    onBlur={() => setShowOption(false)}
                    onChange={(e) => (props.onSearch ? props.onSearch(e.target.value) : () => {})}
                  />
                </div>
              </div>
              <div className='text-gray-300 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-200'>
                <button
                  onClick={() => setShowOption((prev) => !prev)}
                  className='cursor-pointer w-6 h-6 text-gray-600 outline-none focus:outline-none'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='100%'
                    height='100%'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className={
                      'feather feather-chevron-up w-4 h-4 transition-all duration-100 ' +
                      (showOption ? 'rotate-180' : '')
                    }
                  >
                    <polyline points='18 15 12 9 6 15'></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div
            onBlurCapture={() => console.log('blur......')}
            className={
              'absolute shadow-md top-100 bg-white z-50 w-full lef-0 rounded max-h-select overflow-y-auto transition-all duration-100 ' +
              (showOption ? '' : 'opacity-0 invisible')
            }
          >
            <div className='flex flex-col w-full'>
              {props.options.map((e, idx) => {
                return (
                  <Option
                    key={idx}
                    chosen={props.selectedValues.includes(e.value)}
                    label={e.label}
                    onChoose={() => handleChoose(e.value)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectedItem(props: { label: string; value: string; onRemove: () => void }) {
  return (
    <div className='flex justify-center items-center gap-1 font-medium py-1 px-2 rounded-full text-indigo-600 bg-indigo-100 border border-indigo-300 '>
      <div className='text-xs font-medium leading-none max-w-full flex-initial whitespace-nowrap'>{props.label}</div>
      <div className='flex flex-auto flex-row-reverse'>
        <button onClick={() => props.onRemove()}>
          <CloseIcon className='w-4 h-4' />
        </button>
      </div>
    </div>
  );
}

function Option(props: { chosen: boolean; label: string; onChoose: () => void }) {
  return (
    <div
      onClick={() => props.onChoose()}
      className={
        'cursor-pointer w-full border-gray-100 rounded-t border-b hover:bg-indigo-100 ' +
        (props.chosen ? 'bg-indigo-200 hover:bg-indigo-200' : '')
      }
    >
      <div
        className={
          'flex w-full items-center p-2 pl-2 border-transparent border-l-4 relative hover:border-indigo-500 transition-all duration-100 ' +
          (props.chosen ? ' border-l-4 border-indigo-600 font-semibold' : '')
        }
      >
        <div className='w-full items-center flex'>
          <span className='text-sm font-medium leading-6'>{props.label}</span>
        </div>
      </div>
    </div>
  );
}
