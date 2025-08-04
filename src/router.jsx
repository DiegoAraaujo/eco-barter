import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './components/layout/RootLayout';

import WelcomePage from './pages/WelcomePage';
//import Login from './pages/Login';
import PersonalData from './pages/PersonalData';
//import AddItem from './pages/AddItem';
import ItemDetails from './pages/ItemDetails';
//import MyArea from './pages/MyArea';

const router = createBrowserRouter([
  // Rotas sem layout
  { path: '/', element: <WelcomePage /> },
  //{ path: '/login', element: <Login /> },
  //{ path: '/add-item', element: <AddItem /> }, // temporário
  //{ path: '/my-area', element: <MyArea /> }, // temporário

  // Rotas com layout
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { path: 'personal-data', element: <PersonalData /> },
      //{ path: 'add-item', element: <AddItem /> },
      { path: 'item-details/:id', element: <ItemDetails /> },
      //{ path: 'my-area', element: <MyArea /> }, 
    ],
  },
]);

export default router;
