/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { IStream } from '../entities/stream.entity';
import {
  CreateNewStreamButton,
  CreateNewStreamPopup,
  GuidancePopup,
  MyStreamList,
} from '../page_components/my_streams_page.component';
import { APIBuilder } from '../services/base.service';
import streamService from '../services/stream.service';

export default function MyStreamsPage() {
  const [createStreamPopupVisible, setCreateNewStreamPopupVisible] = useState(false);
  const [guidanceCommandPopupVisible, setGuidanceCommandPopupVisible] = useState(false);
  const [streams, setStreams] = useState<IStream[]>([]);
  const [selectedStream, setSelectedStream] = useState<IStream>({} as IStream);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const handleNew = (stream: IStream) => {
    setStreams((prev) => [stream, ...prev]);
    setCreateNewStreamPopupVisible(false);
    setSelectedStream(stream);
    setGuidanceCommandPopupVisible(true);
  };
  const handleItemClick = (stream: IStream) => {
    if (!stream.is_publishing) {
      setSelectedStream(stream);
      setGuidanceCommandPopupVisible(true);
    }
  };
  const fetchMyStreams = async () => {
    setIsLoading(true);
    try {
      const apiBuilder = new APIBuilder().setPage(page + 1);
      const res = await streamService.FetchMyStreams(apiBuilder);
      setStreams((prev) => [...prev, ...res.result]);
      setPage(page + 1);
      setTotal(res.total);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchMyStreams();
  }, []);

  return (
    <div className='flex flex-col gap-4'>
      <CreateNewStreamButton onClick={() => setCreateNewStreamPopupVisible(true)} />
      <MyStreamList isLoading={isLoading} streams={streams} onItemClick={handleItemClick} />
      {createStreamPopupVisible && (
        <CreateNewStreamPopup onClose={() => setCreateNewStreamPopupVisible(false)} onNew={handleNew} />
      )}
      {guidanceCommandPopupVisible && (
        <GuidancePopup
          guidancePublishCommand={selectedStream.guidance_command}
          onClose={() => setGuidanceCommandPopupVisible(false)}
        />
      )}
    </div>
  );
}
