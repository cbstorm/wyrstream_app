import _ from 'lodash';
import { Popup, PopupCloseActionButton } from '../components/Popup.component';
import { MediaOwner } from '../components/User.component';
import { VideoPlayer, VideoTypes } from '../components/Video.component';
import ThumbnailComponent from '../components/VideoThumbnail.component';
import { IStream } from '../entities/stream.entity';

export function StreamList(props: { isLoading: boolean; streams: IStream[]; onItemClick: (stream: IStream) => void }) {
  return (
    <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4'>
      {props.streams.map((e, idx) => {
        return <StreamItem key={idx} stream={e} onClick={() => props.onItemClick(e)} />;
      })}
      {props.isLoading &&
        _.times(4, (i) => {
          return <StreamItemSkeleton key={i} />;
        })}
      {!props.isLoading && !props.streams.length && (
        <div className='flex justify-center col-span-full'>
          <span className='text-gray-600 font-medium'>
            No streams available at the moment. Check back soon for live action or explore other content!
          </span>
        </div>
      )}
    </div>
  );
}

export function StreamItem(props: { stream: IStream; onClick: () => void }) {
  return (
    <div
      onClick={() => props.onClick()}
      className='fade-in shadow-lg overflow-hidden rounded-lg flex flex-col gap-2 bg-slate-50 cursor-pointer hover:shadow-xl transition-all duration-100'
    >
      <ThumbnailComponent thumbnail_url={props.stream.thumbnail_url} />
      <div className='px-2 flex justify-between flex-col'>
        <div className='h-auto'>
          <div className='flex justify-end'>
            <span className='font-semibold text-xs text-indigo-400'>#{props.stream.stream_id}</span>
          </div>
          <h2 className='font-semibold text-gray-800'>{props.stream.title}</h2>
          <div className='h-auto truncate'>
            <span className='text-sm text-gray-600'>{props.stream.description}</span>
          </div>
        </div>
        <MediaOwner user={props.stream.publisher} />
      </div>
    </div>
  );
}

function StreamItemSkeleton() {
  return <div className='h-60 rounded-lg bg-slate-300 animate-pulse'></div>;
}

export function ViewStreamPopup(props: { stream: IStream; onClose: () => void }) {
  return (
    <Popup
      title={props.stream.title}
      className='flex flex-col gap-1 w-[80%] h-[80%]'
      action={[
        <div key={0} className='flex w-full gap-1 justify-between'>
          <div className='flex gap-1 w-full justify-end'>
            <PopupCloseActionButton onClose={() => props.onClose()} />
          </div>
        </div>,
      ]}
    >
      <div className='w-full h-full p-4 flex flex-col gap-2'>
        <VideoPlayer
          src={props.stream.hls_url}
          type={VideoTypes.X_MPEGURL}
          autoplay
          controls
          className='w-full h-full object-cover rounded-lg'
        />
      </div>
    </Popup>
  );
}
