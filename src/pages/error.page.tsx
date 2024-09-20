import { ErrorCharacter } from '../assets/error_character';

export default function ErrorPage() {
  return (
    <div className='w-screen h-screen flex bg-blue-950 p-20'>
      <div className='h-full flex flex-col justify-center'>
        <h1 className='text-9xl font-bold text-gray-200'>404</h1>
        <h2 className='text-5xl text-gray-300'>Something went wrong!</h2>
      </div>
      <ErrorCharacter className='w-[80%] h-[80%]' />
    </div>
  );
}
