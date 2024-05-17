
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Product from './Component/Product';
import { Provider } from 'react-redux';
import compstore from './Redux/Store';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Provider store={compstore}>
    <BrowserRouter>

      <Routes>
       <Route path='/' element={<Product></Product>}></Route>
      </Routes>
    </BrowserRouter>
    <ToastContainer position='top-right'></ToastContainer>
    </Provider>
  );
}

export default App;
