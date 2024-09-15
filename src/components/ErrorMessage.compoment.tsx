import ExclaimationIcon from "../icons/Exclaimation.icon";

export default function ErrorMessage(props: { message: string }) {
  return (
    <div className='flex justify-center items-center gap-1'>
        <ExclaimationIcon className="w-5 h-5 text-red-500" />
      <span className='text-sm text-red-500 font-medium'>{props.message}</span>
    </div>
  );
}
