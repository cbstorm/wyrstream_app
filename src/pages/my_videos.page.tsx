/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IVod } from '../entities/vod.entity';
import { APIBuilder } from '../services/base.service';
import vodService from '../services/vod.service';

export default function MyVideosPage() {
  const navigate = useNavigate();
  const [myVods, setMyVods] = useState<IVod[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
  };
  useEffect(() => {
    fetchMyVods();
  }, []);
  return (
    <div className='flex flex-col gap-4'>
      <h2 className='text-lg font-semibold text-gray-800'>My videos</h2>
    </div>
  );
}

function MyVODList(props: { vods: IVod[] }) {
  return (
    <div className='grid grid-cols-4 gap-4'>
      {props.vods.map((e, idx) => {
        return <MyVOD vod={e} key={idx} />;
      })}
    </div>
  );
}

function MyVOD(props: { vod: IVod }) {
  return <div></div>;
}
