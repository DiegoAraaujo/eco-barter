import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './components/layout/RootLayout';

import WelcomePage from './pages/WelcomePage';
import MyAccount from './pages/MyAccount';
import PersonalData from './pages/PersonalData';
import AddItem from './pages/AddItem';
import ItemDetails from './pages/ItemDetails';
import Login from './pages/Login';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { path: '', element: <WelcomePage /> },
      { path: 'my-account', element: <MyAccount /> },
      { path: 'personal-data', element: <PersonalData /> },
      { path: 'add-item', element: <AddItem /> },
      { path: 'item-details/:id', element: <ItemDetails /> },
      { path: 'login', element: <Login /> },
    ],
  },
]);

export default router;
