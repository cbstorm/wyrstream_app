import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import './index.css';
import CreateAccountPage from './pages/create_account.page';
import LoginPage from './pages/login.page';
import MainPage from './pages/main.page';

const router = createBrowserRouter([
  {
    path: '*',
    element: MainPage(),
  },
  { path: '/login', element: LoginPage() },
  { path: '/create_account', element: CreateAccountPage() },
]);
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <RecoilRoot>
    <RouterProvider router={router} />
  </RecoilRoot>
);
