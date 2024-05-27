import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from "./components/navbar";
import Dashboard from "./pages/dashboard";
import Bookmarks from './pages/bookmarks';
import Board from './pages/board';
import Auth from './pages/authentication';
import Explore from './pages/explore';
import Landing from './pages/landing';
import Analytics from './pages/analytics';

function App() {
  return (
      <div className="app-container flex flex-col h-screen">
        <Navbar/>
        <Routes>
            <Route path="/" element={<Landing/>} />
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/explore" element={<Explore/>} />
            <Route path="/board/:boardName/:boardId" element={<Board/>} />
            <Route path="/authentication" element={<Auth/>} />
            <Route path="/analytics" element={<Analytics/>} />
            <Route path="/bookmarks" element={<Bookmarks/>} />
        </Routes>
        <div className="flex-1 -z-50 relative">
          <div style={{ background: 'linear-gradient(to top, white, rgba(255, 255, 255, 0.5)', boxShadow: '0 0 120px 150px rgba(255, 255, 255, 0.5)'}} className="absolute bottom-0 w-full h-2/6 bg-white "></div>
        </div>
      </div>
  );
}

export default App;
