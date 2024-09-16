/* eslint-disable eqeqeq */
import CheckIcon from '../icons/Check.icon';
import CloseIcon from '../icons/Close.icon';
import ExclaimationIcon from '../icons/Exclaimation.icon';
import SpinnerIcon from '../icons/Spinner.icon';

export function Popup(props: {
  className?: string;
  children: JSX.Element | JSX.Element[];
  action?: JSX.Element[];
  floatingAction?: 'row-start' | 'col-start' | 'row-end' | 'col-end';
  title?: string;
}) {
  return (
    <div
      className={
        'fade-in fixed inset-0 flex justify-center items-center w-screen h-screen bg-black z-30 bg-opacity-60 transition-all duration-200'
      }
    >
      <div
        className={'fade-in relative w-[80%] bg-gray-100 rounded-lg shadow-lg overflow-y-auto p-4 ' + props.className}
      >
        {props.title && <h2 className='font-bold text-gray-800 text-xl'>{props.title}</h2>}
        {props.children}
        <div
          className={
            'flex gap-2 items-center justify-end ' +
            (props.floatingAction?.includes('col') ? 'flex-col' : '') +
            (props.floatingAction?.includes('start') ? 'justify-start' : '')
          }
        >
          {props.action}
        </div>
      </div>
    </div>
  );
}

export function PopupCloseActionButton(props: { onClose: () => void }) {
  return (
    <div className='flex justify-end'>
      <button
        onClick={() => props.onClose()}
        className='flex gap-1 items-center bg-white border border-red-500 rounded-lg px-3 py-2 text-red-500 text-sm font-semibold hover:bg-red-100 hover:text-opacity-60 transition-all duration-100 '
      >
        <span className='p-1 bg-red-200 bg-opacity-50 rounded-full'>
          <CloseIcon className='w-4 h-4' />
        </span>
        <span>Close</span>
      </button>
    </div>
  );
}

export function PopupSubmitActionButton(props: { onSubmit: () => void; disabled?: boolean; isSubmitting?: boolean }) {
  return (
    <div className='flex justify-end'>
      <button
        disabled={props.disabled}
        onClick={() => props.onSubmit()}
        className='flex gap-1 items-center bg-amber-500 border border-amber-500 rounded-lg px-3 py-2 text-white text-sm font-semibold hover:bg-amber-600 transition-all duration-100 disabled:opacity-60'
      >
        <span className='p-1 bg-amber-200 bg-opacity-50 rounded-full'>
          <CheckIcon className='w-4 h-4' />
        </span>
        {props.isSubmitting && (
          <span className='p-1 bg-amber-200 bg-opacity-50 rounded-full'>
            <SpinnerIcon className='w-4 h-4 text-amber-500 ' />
          </span>
        )}
        <span>Submit</span>
      </button>
    </div>
  );
}

export function PopupException(props: { message: string }) {
  return (
    <div className='flex justify-center items-center gap-1 flex-shrink-0'>
      <ExclaimationIcon className='w-5 h-5 text-red-500' />
      <span className='text-sm text-red-500 font-medium'>{props.message}</span>
    </div>
  );
}
