/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IStream } from '../entities/stream.entity';
import { StreamList, ViewStreamPopup } from '../page_components/streams_page.component';
import { APIBuilder } from '../services/base.service';
import streamService from '../services/stream.service';

export default function StreamsPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [streams, setStreams] = useState<IStream[]>([]);
  const [selectedStream, setSelectedStream] = useState<IStream>({} as IStream);
  const [viewStreamPopupVisible, setViewStreamPopupVisible] = useState(false);
  const handleItemClick = (stream: IStream) => {
    setSelectedStream(stream);
    setViewStreamPopupVisible(true);
  };
  const fetchStreams = async () => {
    setIsLoading(true);
    try {
      const apiBuilder = new APIBuilder().setPage(page + 1).setIncludes('publisher');
      const res = await streamService.FetchStreams(apiBuilder);
      setStreams((prev) => [...prev, ...res.result]);
      setPage(page + 1);
      setTotal(res.total);
    } catch (error) {
      console.log(error);
      navigate('/error');
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchStreams();
  }, []);
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-lg font-semibold text-gray-800'>Streams</h2>
      </div>
      <StreamList isLoading={isLoading} streams={streams} onItemClick={handleItemClick} />
      {viewStreamPopupVisible && (
        <ViewStreamPopup stream={selectedStream} onClose={() => setViewStreamPopupVisible(false)} />
      )}
    </div>
  );
}
