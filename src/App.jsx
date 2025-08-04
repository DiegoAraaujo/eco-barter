import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RootLayout from './components/layout/RootLayout'; // Ajuste o caminho conforme necessário
import MyArea from './pages/myArea';
import ItemDetails from './pages/ItemDetails';
import WelcomePage from './pages/WelcomePage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas envolvidas pelo RootLayout */}
        <Route element={<RootLayout />}>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/myarea" element={<MyArea />} />
          <Route path="/item/:id" element={<ItemDetails />} />
        </Route>
        
        {/* Exemplo de rota SEM layout (se necessário) */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;