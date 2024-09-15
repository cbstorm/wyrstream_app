import UploadIcon from '../icons/Upload.icon';

export default function UploadFileInput(props: {
  label: string;
  description?: string;
  multiple?: boolean;
  onChange: (files: FileList | null) => void;
}) {
  return (
    <div className='flex flex-col w-full'>
      <label className='py-3 bg-white border border-gray-300 border-dashed w-full rounded-lg cursor-pointer'>
        <div className='grid grid-cols-12'>
          <div className='col-span-3 flex justify-center'>
            <UploadIcon className='text-white w-16 h-16' />
          </div>
          <div className='col-span-6 flex flex-col justify-center gap-1'>
            <span className='text-gray-600 font-semibold'>{props.label}</span>
            {props.description && <span className='text-xs text-gray-300 font-medium'>{props.description}</span>}
            <input
              type='file'
              accept='image/*'
              onChange={(e) => props.onChange(e.target.files)}
              multiple={props.multiple}
              hidden
            />
          </div>
          <div className='col-span-3 flex flex-col justify-center items-center p-4'>
            <span className='p-2 border border-sky-500 text-sky-500 rounded-lg font-semibold '>Select</span>
          </div>
        </div>
      </label>
    </div>
  );
}
