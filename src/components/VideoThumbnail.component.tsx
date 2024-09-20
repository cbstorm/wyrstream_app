import { useState } from 'react';
import { VideoPlaceholder } from '../assets/video_placeholder';

export default function ThumbnailComponent(props: { thumbnail_url: string }) {
  const [isError, setIsError] = useState(false);
  if (props.thumbnail_url && !isError) {
    return (
      <img
        src={props.thumbnail_url}
        onError={() => setIsError(true)}
        alt='thumbnail'
        className='w-full h-36 object-cover shadow-sm rounded-b-md'
      />
    );
  }
  return <VideoPlaceholder className='w-full h-36 object-cover shadow-sm rounded-b-md' />;
}
