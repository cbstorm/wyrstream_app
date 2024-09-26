import _ from 'lodash';
import moment from 'moment-timezone';
import { Popup, PopupCloseActionButton } from '../components/Popup.component';
import { VideoPlayer, VideoTypes } from '../components/Video.component';
import ThumbnailComponent from '../components/VideoThumbnail.component';
import { IVod } from '../entities/vod.entity';

export function MyVODList(props: { vods: IVod[]; isLoading: boolean; onItemClick: (vod: IVod) => void }) {
  return (
    <div className='grid grid-cols-4 gap-4'>
      {props.vods.map((e, idx) => {
        return <MyVOD vod={e} key={idx} onClick={() => props.onItemClick(e)} />;
      })}
      {props.isLoading &&
        _.times(4, (i) => {
          return <MyMyVODSkeleton key={i} />;
        })}
      {!props.isLoading && !props.vods.length && (
        <div className='flex justify-center col-span-full'>
          <span className='text-gray-600 font-medium'>You do not have any videos</span>
        </div>
      )}
    </div>
  );
}

export function MyVOD(props: { vod: IVod; onClick: () => void }) {
  return (
    <div
      onClick={() => props.onClick()}
      className='fade-in shadow-lg overflow-hidden rounded-lg flex flex-col gap-2 bg-slate-50 cursor-pointer hover:shadow-xl transition-all duration-100'
    >
      <ThumbnailComponent thumbnail_url={props.vod.thumbnail_url} />
      <div className='px-2 flex justify-between flex-col'>
        <div className='h-auto'>
          <h2 className='font-semibold text-gray-800'>{props.vod.title}</h2>
          <div className='h-auto truncate'>
            <span className='text-sm text-gray-600'>{props.vod.description}</span>
          </div>
        </div>
        <div className='flex justify-end'>
          <span className='text-xs py-2 text-gray-600 italic'>{moment(props.vod.createdAt).format('DD/MM/YYYY')}</span>
        </div>
      </div>
    </div>
  );
}

export function MyVODViewPopup(props: { vod: IVod; onClose: () => void }) {
  return (
    <Popup
      title={props.vod.title}
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
          src={props.vod.hls_url}
          type={VideoTypes.X_MPEGURL}
          autoplay
          controls
          className='w-full h-full object-cover rounded-lg'
        />
      </div>
    </Popup>
  );
}

export function MyMyVODSkeleton() {
  return <div className='h-60 rounded-lg bg-slate-300 animate-pulse'></div>;
}
