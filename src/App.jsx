import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AppProvider } from './context/AppProvider.jsx'
import Background from './components/Background.jsx'
import RouteSeo from './components/RouteSeo.jsx'
import NoticeBar from './components/NoticeBar.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import MobileNav from './components/MobileNav.jsx'
import Modals from './components/Modals.jsx'
import Toasts from './components/Toasts.jsx'
import Home from './pages/Home.jsx'
import Browse from './pages/Browse.jsx'
import PostRequest from './pages/PostRequest.jsx'
import Support from './pages/Support.jsx'
import Policies from './pages/Policies.jsx'
import Profile from './pages/Profile.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import TermsAndConditions from './pages/TermsAndConditions.jsx'
import RefCapture from './pages/RefCapture.jsx'
import AuthPage from './pages/AuthPage.jsx'
import Admin from './pages/Admin.jsx'
import AdminLogin from './pages/AdminLogin.jsx'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname, hash])
  return null
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <RouteSeo />
        <div className="relative z-[1] min-h-screen flex flex-col text-slate-900 antialiased pb-24 md:pb-12">
          <Background />
          <Toasts />
          <NoticeBar />
          <Navbar />
          <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-5 sm:pt-7">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/post" element={<PostRequest />} />
              <Route path="/support" element={<Support />} />
              <Route path="/policies" element={<Policies />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/login" element={<AuthPage mode="login" />} />
              <Route path="/register" element={<AuthPage mode="register" />} />
              <Route path="/ref/:code" element={<RefCapture />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
          <MobileNav />
          <Modals />
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
