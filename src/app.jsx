import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@did-connect/react';

import { LocaleProvider } from '@arcblock/ux/lib/Locale/context';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SessionProvider } from './libs/session';

import { translations } from './locales';
import './app.css';
import Home from './pages/home';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default function WrappedApp() {
  // While the blocklet is deploy to a sub path, this will be work properly.
  const basename = window?.blocklet?.prefix || '/';

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider>
        <LocaleProvider translations={translations}>
          <SessionProvider serviceHost={basename}>
            <Router basename={basename}>
              <App />
            </Router>
          </SessionProvider>
        </LocaleProvider>
      </ThemeProvider>
    </LocalizationProvider>
  );
}
