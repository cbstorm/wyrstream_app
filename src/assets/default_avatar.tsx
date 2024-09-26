import DEFAULT_AVATAR from './default_avatar.png';
export default function DefaultAvatar(
  props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
) {
  return <img src={DEFAULT_AVATAR} alt='default_avatar' {...props} />;
}
