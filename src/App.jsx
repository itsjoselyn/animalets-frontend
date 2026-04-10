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
import TestimonioPage from "./pages/TestimonioPage";
import PrivacidadPage from './pages/PrivacidadPage';
import CatProfilePage from "./pages/CatProfilePage";
import BlogPostPage from "./pages/BlogPostPage";
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <Routes>

        {/* Testimonio — sin navbar ni footer */}
        <Route path="/testimonios/:id" element={<TestimonioPage />} />

        {/* Card de cada gato individual*/}
        <Route path="/nuestros-peludos/:id" element={<CatProfilePage />} />

        {/* Card de cada noticia individual*/}
        <Route path="/blog/:id" element={<BlogPostPage />} />


        {/* Resto — con navbar y footer */}
        <Route path="/*" element={
          <>
            <Navbar />
            <main style={{ paddingTop: '76px' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sobre-nosotros" element={<SobreNosotros />} />
                <Route path="/nuestros-peludos" element={<NuestrosPeludos />} />
                <Route path="/como-ayudar" element={<ComoAyudar />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/privacidad" element={<PrivacidadPage />} />
              </Routes>
            </main>
            <Footer />
          </>
        } />

      </Routes>
    </BrowserRouter>
  );
}