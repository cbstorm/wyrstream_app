/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';

export enum VideoTypes {
  X_MPEGURL = 'application/x-mpegurl',
  MPEG4 = 'video/mp4',
}

export function VideoPlayer(props: {
  src: string;
  type: VideoTypes;
  autoplay?: boolean;
  controls?: boolean;
  responsive?: boolean;
  fluid?: boolean;
}) {
  const playerRef = useRef(null);

  const videoJsOptions = {
    autoplay: props.autoplay,
    controls: props.controls,
    responsive: props.responsive,
    fluid: props.fluid,
    sources: [
      {
        src: props.src,
        type: props.type,
      },
    ],
  };

  const handlePlayerReady = (player: Player) => {
    (playerRef as any).current = player;

    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };

  return <Video options={videoJsOptions} onReady={handlePlayerReady} />;
}

export function Video(props: { options: any; onReady: (player: Player) => any }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const { options, onReady } = props;

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement('video-js');

      videoElement.classList.add('vjs-big-play-centered');
      videoElement.classList.add('w-full');
      videoElement.classList.add('object-cover');
      (videoRef.current as any).appendChild(videoElement);

      const player = ((playerRef as any).current = videojs(videoElement, options, () => {
        videojs.log('player is ready');
        onReady && onReady(player);
      }));
    } else {
      const player = playerRef.current;

      (player as any).autoplay(options.autoplay);
      (player as any).src(options.sources);
    }
  }, [options, videoRef]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !(player as any).isDisposed()) {
        (player as any).dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player className='w-full'>
      <div className='w-full' ref={videoRef} />
    </div>
  );
}
