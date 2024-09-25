/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IStream } from '../entities/stream.entity';
import {
  ConfirmActionPopup,
  CreateNewStreamButton,
  CreateNewStreamPopup,
  MyStreamList,
  MyStreamViewPopup,
  StreamInfoPopup,
} from '../page_components/my_streams_page.component';
import { APIBuilder } from '../services/base.service';
import streamService from '../services/stream.service';

export default function MyStreamsPage() {
  const navigate = useNavigate();
  const [createStreamPopupVisible, setCreateNewStreamPopupVisible] = useState(false);
  const [streamInfoPopupVisible, setStreamInfoPopupVisible] = useState(false);
  const [viewStreamPopupVisible, setViewStreamPopupVisible] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'conv-vod' | 'close-stream'>('close-stream');
  const [confirmActionPopupVisible, setConfirmActionPopup] = useState(false);
  const [streams, setStreams] = useState<IStream[]>([]);
  const [selectedStream, setSelectedStream] = useState<IStream>({} as IStream);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const handleNew = (stream: IStream) => {
    setStreams((prev) => [stream, ...prev]);
    setCreateNewStreamPopupVisible(false);
    setSelectedStream(stream);
    setStreamInfoPopupVisible(true);
  };
  const handleItemClick = (stream: IStream) => {
    setSelectedStream(stream);
    if (!stream.is_publishing) {
      setStreamInfoPopupVisible(true);
      return;
    }
    setViewStreamPopupVisible(true);
  };
  const fetchMyStreams = async () => {
    setIsLoading(true);
    try {
      const apiBuilder = new APIBuilder().setPage(page + 1).setIncludes('stream_logs');
      const res = await streamService.FetchMyStreams(apiBuilder);
      setStreams((prev) => [...prev, ...res.result]);
      setPage(page + 1);
      setTotal(res.total);
    } catch (error) {
      console.log(error);
      navigate('/error');
    }
    setIsLoading(false);
  };

  const handleConvertVOD = async (stream: IStream) => {
    try {
      const apiBuilder = new APIBuilder().addParam(stream._id);
      await streamService.ConvertStreamToVOD(apiBuilder);
      setStreams((prev) => prev.filter((e) => e._id !== stream._id));
      setConfirmActionPopup(false);
    } catch (error) {
      console.log(error);
      navigate('/error');
    }
  };

  const handleCloseStream = async (stream: IStream) => {
    try {
      const apiBuilder = new APIBuilder().addParam(stream._id);
      await streamService.DeleteOneStream(apiBuilder);
      setStreams((prev) => prev.filter((e) => e._id !== stream._id));
      setConfirmActionPopup(false);
    } catch (error) {
      console.log(error);
      navigate('/error');
    }
  };

  useEffect(() => {
    fetchMyStreams();
  }, []);

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-lg font-semibold text-gray-800'>My streams</h2>
        <CreateNewStreamButton onClick={() => setCreateNewStreamPopupVisible(true)} />
      </div>
      <MyStreamList isLoading={isLoading} streams={streams} onItemClick={handleItemClick} />
      {createStreamPopupVisible && (
        <CreateNewStreamPopup onClose={() => setCreateNewStreamPopupVisible(false)} onNew={handleNew} />
      )}
      {streamInfoPopupVisible && (
        <StreamInfoPopup
          stream={selectedStream}
          onConvertVOD={() => {
            setStreamInfoPopupVisible(false);
            setConfirmAction('conv-vod');
            setConfirmActionPopup(true);
          }}
          closeStream={() => {
            setStreamInfoPopupVisible(false);
            setConfirmAction('close-stream');
            setConfirmActionPopup(true);
          }}
          onClose={() => setStreamInfoPopupVisible(false)}
        />
      )}
      {confirmActionPopupVisible && (
        <ConfirmActionPopup
          onConfirm={() => {
            if (confirmAction === 'conv-vod') {
              handleConvertVOD(selectedStream);
              return;
            }
            handleCloseStream(selectedStream);
          }}
          onCancel={() => setConfirmActionPopup(false)}
          type={confirmAction}
        />
      )}
      {viewStreamPopupVisible && (
        <MyStreamViewPopup stream={selectedStream} onClose={() => setViewStreamPopupVisible(false)} />
      )}
    </div>
  );
}
