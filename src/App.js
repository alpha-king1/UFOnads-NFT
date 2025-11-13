import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Raffle from './pages/Raffle';
import Mint from './pages/Mint';
import Checker from './pages/Checker';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/raffle" element={<Raffle />} />
        <Route path="/mint" element={<Mint />} />
        <Route path="/checker" element={<Checker />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;