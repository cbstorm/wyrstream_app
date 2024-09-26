/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import Header from '../components/Header.component';
import { ConsoleSidebar } from '../components/Sidebar.component';
import authService from '../services/auth.service';
import { UserState } from '../states/user.state';
import MyStreamsPage from './my_streams.page';
import MyVideosPage from './my_videos.page';

export default function ConsolePage() {
  return (
    <div>
      <ConsoleComponent />
    </div>
  );
}

function ConsoleComponent() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useRecoilState(UserState);
  const getMe = async () => {
    if (user._id) return;
    setIsLoading(true);
    try {
      const res = await authService.GetMe();
      setUser({
        _id: res?._id,
        email: res?.email,
        name: res?.name,
        createdAt: res?.createdAt,
        updatedAt: res?.updatedAt,
      });
    } catch (error) {
      console.log('getMe: ', error);
      navigate('/login');
    }
    setIsLoading(false);
  };
  useEffect(() => {
    getMe();
  }, []);
  return (
    <div className='flex'>
      <ConsoleSidebar className='w-1/6 h-screen fixed z-20 border-r' isLoading={isLoading} />
      <div className='relative w-full h-screen flex'>
        <Header isLoading={isLoading} />
        <div className='w-1/6 z-0 opacity-0'></div>
        <div className='pt-24 px-8 w-5/6'>
          <Routes>
            <Route path='/my_streams' element={<MyStreamsPage />} />
            <Route path='/my_videos' element={<MyVideosPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
