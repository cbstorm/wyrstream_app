import VIDEO_PLACEHOLDER from './video_placeholder.jpg';

export function VideoPlaceholder(
  props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
) {
  return <img src={VIDEO_PLACEHOLDER} alt='video_placeholder' {...props} />;
}
