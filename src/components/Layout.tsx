import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { FloatingSocialButtons } from './FloatingSocialButtons';
import { DocumentMeta, MotionController, ScrollManager } from './PageEffects';

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <DocumentMeta />
      <ScrollManager />
      <MotionController />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingSocialButtons />
    </div>
  );
}
