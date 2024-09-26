import { IUser } from '../entities/user.enity';
import Avatar from './Avatar.component';

export function MediaOwner(props: { user: IUser }) {
  return (
    <div className='py-2 flex items-center gap-1'>
      <Avatar src={props.user?.avatarUrl} className='w-8 h-8 rounded-full overflow-hidden' />
      <span className='text-gray-600 text-sm font-semibold'>{props.user?.name}</span>
    </div>
  );
}
