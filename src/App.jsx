import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import NuestrosPeludos from './pages/NuestrosPeludos';
import ComoAyudar from "./pages/ComoAyudar";
import Blog from "./pages/Blog";
import Contacto from "./pages/Contacto";
import SobreNosotros from "./pages/SobreNosotros"
import Footer from "./components/layout/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre-nosotros" element={<SobreNosotros />} />
          <Route path="/nuestros-peludos" element={<NuestrosPeludos />} />
          <Route path="/como-ayudar" element={<ComoAyudar />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contacto" element={<Contacto />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}