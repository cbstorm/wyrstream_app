/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import _ from 'lodash';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Popup, PopupCloseActionButton } from '../components/Popup.component';
import { VideoPlayer, VideoTypes } from '../components/Video.component';
import ThumbnailComponent from '../components/VideoThumbnail.component';
import { IVod } from '../entities/vod.entity';
import { APIBuilder } from '../services/base.service';
import vodService from '../services/vod.service';

export default function MyVideosPage() {
  const navigate = useNavigate();
  const [myVods, setMyVods] = useState<IVod[]>([]);
  const [selectedVod, setSelectedVod] = useState<IVod>({} as IVod);
  const [isLoading, setIsLoading] = useState(true);
  const [viewVODPopupVisible, setViewVODPopupVisible] = useState(false);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const fetchMyVods = async () => {
    try {
      const apiBuilder = new APIBuilder().setPage(page + 1);
      const res = await vodService.FetchMyVods(apiBuilder);
      setMyVods((prev) => [...prev, ...res.result]);
      setPage((p) => p + 1);
      setTotal(res.total);
    } catch (error) {
      navigate('/error');
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchMyVods();
  }, []);
  return (
    <div className='flex flex-col gap-4'>
      <h2 className='text-lg font-semibold text-gray-800'>My videos</h2>
      <MyVODList
        vods={myVods}
        isLoading={isLoading}
        onItemClick={(vod) => {
          setSelectedVod(vod);
          setViewVODPopupVisible(true);
        }}
      />
      {viewVODPopupVisible && <MyVODViewPopup vod={selectedVod} onClose={() => setViewVODPopupVisible(false)} />}
    </div>
  );
}

function MyVODList(props: { vods: IVod[]; isLoading: boolean; onItemClick: (vod: IVod) => void }) {
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

function MyVOD(props: { vod: IVod; onClick: () => void }) {
  return (
    <div
      onClick={() => props.onClick()}
      className='fade-in shadow-lg overflow-hidden rounded-lg flex flex-col gap-2 bg-slate-50 cursor-pointer hover:shadow-xl transition-all duration-100'
    >
      <ThumbnailComponent thumbnail_url={props.vod.thumbnail_url} />
      <div className='px-2 flex justify-between flex-col h-full'>
        <div className='h-full'>
          <h2 className='font-semibold text-gray-800'>{props.vod.title}</h2>
          <span className='text-sm text-gray-600'>{props.vod.description}</span>
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

function MyMyVODSkeleton() {
  return <div className='h-60 rounded-lg bg-slate-300 animate-pulse'></div>;
}
