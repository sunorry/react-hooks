import './App.css';
import UserList from './UserList'
import HighResize from './HighResize'
import HooksResize from './HooksResize'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
      </header>
      <UserList />
      <HighResize />
      <HooksResize />
    </div>
  );
}

export default App;
