export function Input(props: {
  label?: string;
  name: string;
  placeholder: string;
  password?: boolean;
  number?: boolean;
  value: string | number;
  onChange: (value: string | number) => void;
  disabled?: boolean;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className='flex flex-col gap-1 items-start'>
      {props.label && (
        <label className='block text-xs font-semibold text-gray-600 text-center line'>{props.label}</label>
      )}
      <div className='flex gap-1 items-center w-full'>
        {props.prefix && (
          <div className='p-2 h-full rounded-md bg-slate-200 flex justify-center items-center'>
            <span className='font-semibold text-sm text-gray-600'>{props.prefix}</span>
          </div>
        )}
        <input
          type={props.password ? 'password' : props.number ? 'number' : 'text'}
          name={props.name}
          placeholder={props.placeholder}
          className='w-full rounded-md border-[1px] border-gray-200 bg-white text-sm text-gray-600 shadow-sm px-4 py-3 disabled:bg-gray-200'
          onChange={(e) => props.onChange(props.number ? Number(e.target.value) : e.target.value)}
          disabled={props.disabled}
          value={props.value || (props.number ? undefined : '')}
        />
        {props.suffix && (
          <div className='p-2 h-full rounded-md bg-slate-200 flex justify-center items-center'>
            <span className='font-semibold text-sm text-gray-600'>{props.suffix}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function CheckBox(props: {
  name: string;
  label?: string;
  title: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className='flex flex-col gap-1 items-start'>
      {props.label && (
        <label className='block text-xs font-semibold text-gray-600 text-center line'>{props.label}</label>
      )}
      <label
        className='flex cursor-pointer items-start gap-4 rounded-lg border bg-gray-50 border-gray-200 p-4 transition hover:bg-blue-50 has-[:checked]:bg-blue-100 w-full has-[:disabled]:bg-gray-200'
      >
        <div className='flex items-center'>
          &#8203;
          <input
            type='checkbox'
            className='size-4 rounded border-gray-300'
            name={props.name}
            checked={props.checked}
            onChange={(e) => props.onChange(e.target.checked)}
            disabled={props.disabled}
          />
        </div>

        <div>
          <strong className='font-medium text-sm text-gray-900'>{props.title}</strong>
          {props.description && <p className='mt-1 text-pretty text-sm text-gray-700'>{props.description}</p>}
        </div>
      </label>
    </div>
  );
}
