/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import Header from '../components/Header.component';
import { MainPageSidebar } from '../components/Sidebar.component';
import authService from '../services/auth.service';
import { UserState } from '../states/user.state';
import StreamsPage from './streams.page';
import VideosPage from './videos.page';

export default function MainPage() {
  return (
    <div>
      <MainPageComponent />
    </div>
  );
}

function MainPageComponent() {
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
    }
    setIsLoading(false);
  };
  useEffect(() => {
    getMe();
  }, []);
  return (
    <div className='flex'>
      <MainPageSidebar className='w-1/6 h-screen fixed z-20 border-r' isLoading={isLoading} />
      <div className='relative w-full h-screen flex'>
        <Header isLoading={isLoading} />
        <div className='w-1/6 z-0 opacity-0'></div>
        <div className='pt-24 px-8 w-5/6'>
          <Routes>
            <Route path='/streams' element={<StreamsPage />} />
            <Route path='/videos' element={<VideosPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
