import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import BoardCard from "./components/board_card";
import Navbar from "./components/navbar";
import Dashboard from "./pages/dashboard";
// import Explore from './components/Explore';
// import Bookmarks from './components/Bookmarks';
import Board from './pages/board';

function App() {

  const initialData = {
    columns: [
      {
        id: 'column-1',
        title: 'To Do',
        cards: [
          { id: 'card-1', title: 'Task 1', description: 'This is task 1', tags: ['Tag1', 'Tag2'], code: '' },
          { id: 'card-2', title: 'Task 2', description: 'This is task 2', tags: ['Tag1', 'Tag2'], code: '' },
        ],
      },
      {
        id: 'column-2',
        title: 'In Progress',
        cards: [{ id: 'card-3', title: 'Task3', description: 'This is task 3', tags: ['Tag1', 'Tag2'], code: ''}],
      },
      {
        id: 'column-3',
        title: 'Done',
        cards: [{ id: 'card-4', title: 'Task 4', description: 'This is task 4', tags: ['Tag1', 'Tag2'], code: '' }],
      },
    ],
  };
  
  const onDragEnd = (result) => {
    console.log("Drag");
    // Logic to update the state based on drag and drop result
  };

  return (
      <div className="app-container flex flex-col h-screen">
        <Navbar/>
        <Routes>
            <Route path="/" element={<Dashboard/>} />
            <Route path="/board" element={<Board lists={initialData.columns} onDragEnd={onDragEnd}/>} />
            {/* <Route path="/bookmarks" component={Bookmarks} /> */}
        </Routes>
        <div className="flex-1 -z-50 relative">
          <div style={{ background: 'linear-gradient(to top, white, rgba(255, 255, 255, 0.5)', boxShadow: '0 0 120px 150px rgba(255, 255, 255, 0.5)'}} className="absolute bottom-0 w-full h-2/6 bg-white "></div>
        </div>
      </div>
  );
}

export default App;
