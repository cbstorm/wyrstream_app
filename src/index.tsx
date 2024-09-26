import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import './index.css';
import ConsolePage from './pages/console.page';
import CreateAccountPage from './pages/create_account.page';
import ErrorPage from './pages/error.page';
import LoginPage from './pages/login.page';
import MainPage from './pages/main.page';

const router = createBrowserRouter([
  {
    path: '/console/*',
    element: ConsolePage(),
  },
  { path: '/login', element: LoginPage() },
  { path: '/create_account', element: CreateAccountPage() },
  { path: '/error', element: ErrorPage() },
  {
    path: '*',
    element: MainPage(),
  },
]);
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <RecoilRoot>
    <RouterProvider router={router} />
  </RecoilRoot>
);
