import './App.css';
import Routes from './router';
import { Provider } from 'react-redux';
import store from './store';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes/>
      </Router>
    </Provider>
  );
}

export default App;
