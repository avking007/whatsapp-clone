import Chatbox from './components/layout/Chatbox';
import SideBar from './components/layout/SideBar';
import './App.css';

function App() {
  return (
    <div className='app'>
      <div className='app__body'>
        <SideBar />
        <Chatbox />
      </div>
    </div>
  );
}

export default App;
