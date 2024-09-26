/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IVod } from '../entities/vod.entity';
import { MyVODList, MyVODViewPopup } from '../page_components/my_videos_page.component';
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
