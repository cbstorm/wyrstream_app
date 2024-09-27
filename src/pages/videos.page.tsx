/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IVod } from '../entities/vod.entity';
import { VODList, VODViewPopup } from '../page_components/videos_page.components';
import { APIBuilder } from '../services/base.service';
import vodService from '../services/vod.service';

export default function VideosPage() {
  const navigate = useNavigate();
  const [vods, setVods] = useState<IVod[]>([]);
  const [selectedVod, setSelectedVod] = useState<IVod>({} as IVod);
  const [isLoading, setIsLoading] = useState(true);
  const [viewVODPopupVisible, setViewVODPopupVisible] = useState(false);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const fetchVods = async () => {
    try {
      const apiBuilder = new APIBuilder().setPage(page + 1).setIncludes('owner');
      const res = await vodService.FetchVods(apiBuilder);
      setVods((prev) => [...prev, ...res.result]);
      setPage((p) => p + 1);
      setTotal(res.total);
    } catch (error) {
      navigate('/error');
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchVods();
  }, []);
  return (
    <div>
      <div className='flex flex-col gap-4'>
        <h2 className='text-lg font-semibold text-gray-800'>Videos</h2>
        <VODList
          vods={vods}
          isLoading={isLoading}
          onItemClick={(vod) => {
            setSelectedVod(vod);
            setViewVODPopupVisible(true);
          }}
        />
        {viewVODPopupVisible && <VODViewPopup vod={selectedVod} onClose={() => setViewVODPopupVisible(false)} />}
      </div>
    </div>
  );
}
