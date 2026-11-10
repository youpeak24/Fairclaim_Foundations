import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { MissionVision } from './pages/MissionVision';
import { Initiatives } from './pages/Initiatives';
import { Contact } from './pages/Contact';
import { Donate } from './pages/Donate';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsConditions } from './pages/TermsConditions';
import { NotFound } from './pages/NotFound';

/** Route table, shared by the browser app and the build-time prerenderer. */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="mission-vision" element={<MissionVision />} />
        <Route path="initiatives" element={<Initiatives />} />
        <Route path="donate" element={<Donate />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms-and-conditions" element={<TermsConditions />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
