import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from 'react-router-dom';

import Navbar from '../components/layout/Navbar';
import Home from '../pages/Home';
import NuestrosPeludos from '../pages/NuestrosPeludos';
import ComoAyudar from "../pages/ComoAyudar";
import Blog from "../pages/Blog";
import Contacto from "../pages/Contacto";
import SobreNosotros from "../pages/SobreNosotros"
import Footer from "../components/layout/Footer";
import TestimonioPage from "../pages/TestimonioPage";
import PrivacidadPage from '../pages/PrivacidadPage';
import CatProfilePage from "../pages/CatProfilePage";
import BlogPostPage from "../pages/BlogPostPage";
import ScrollToTop from '../hooks/ScrollToTop';
import AdminLogin from '../pages/admin/Login';
import AdminLayout from '../pages/admin/AdminLayout';
import AdminGatos from '../pages/admin/Gatos';
import AdminNoticias from '../pages/admin/Noticias';
import AdminTestimonios from '../pages/admin/Testimonios';
import AdminSolicitudes from '../pages/admin/Solicitudes';

const GatoEditor = lazy(() => import('../pages/admin/GatoEditor'));
const NoticiaEditor = lazy(() => import('../pages/admin/NoticiaEditor'));
const TestimonioEditor = lazy(() => import('../pages/admin/TestimonioEditor'));


function AppRouter() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>

                {/* Testimonio — sin navbar ni footer */}
                <Route path="/testimonios/:id" element={<TestimonioPage />} />

                {/* Privacidad sin layout (para modal/iframe) */}
                <Route path="/privacidad-bare" element={<PrivacidadPage />} />

                {/* Card de cada gato individual*/}
                <Route path="/nuestros-peludos/:id" element={<CatProfilePage />} />

                {/* Card de cada noticia individual*/}
                <Route path="/blog/:id" element={<BlogPostPage />} />


                {/* Admin routes (separadas del layout principal) */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="/admin/gatos" replace />} />
                    <Route path="gatos" element={<AdminGatos />} />
                    <Route path="gatos/new" element={
                        <Suspense fallback={<div>Cargando...</div>}>
                            <GatoEditor />
                        </Suspense>
                    } />
                    <Route path="gatos/:id" element={
                        <Suspense fallback={<div>Cargando...</div>}>
                            <GatoEditor />
                        </Suspense>
                    } />
                    <Route path="testimonios" element={<AdminTestimonios />} />
                    <Route path="testimonios/new" element={
                        <Suspense fallback={<div>Cargando...</div>}>
                            <TestimonioEditor />
                        </Suspense>
                    } />
                    <Route path="testimonios/:id" element={
                        <Suspense fallback={<div>Cargando...</div>}>
                            <TestimonioEditor />
                        </Suspense>
                    } />
                    <Route path="noticias" element={<AdminNoticias />} />
                    <Route path="noticias/new" element={
                        <Suspense fallback={<div>Cargando...</div>}>
                            <NoticiaEditor />
                        </Suspense>
                    } />
                    <Route path="noticias/:id" element={
                        <Suspense fallback={<div>Cargando...</div>}>
                            <NoticiaEditor />
                        </Suspense>
                    } />
                    <Route path="solicitudes" element={<AdminSolicitudes />} />
                </Route>

                {/* Resto — con navbar y footer */}
                {/* TODO: Esto debería de ir en MainLayout */}
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
export default AppRouter;