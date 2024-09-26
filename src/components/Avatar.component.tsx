import { useState } from 'react';
import DefaultAvatar from '../assets/default_avatar';

export default function Avatar(props: { src?: string; className?: string }) {
  const [err, setErr] = useState(false);
  return (
    <div className={props.className}>
      {props.src && !err && (
        <img src={props.src} alt='avatar' onError={() => setErr(true)} className='w-full h-full object-cover' />
      )}
      {(!props.src || err) && <DefaultAvatar className='w-full h-full object-cover' />}
    </div>
  );
}
