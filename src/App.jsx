//import './App.css'
//import WelcomePage from './pages/WelcomePage'
//function App() {

//  return (
//   <>
//  <WelcomePage></WelcomePage>
//   </>
//  )
//}

//export default App


//SUGESTÃO SÂMIA

import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router';

function App() {
  return <RouterProvider router={router} />;
}

export default App;
