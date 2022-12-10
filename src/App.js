import logo from './logo.svg';
import './App.css';
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import Ceam from './Pages/Ceam/Ceam';
import CeamRoster from './Pages/Ceam/CeamRoster';
import '@shoelace-style/shoelace/dist/themes/light.css';

import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path';
import CeamOtRoster from './Pages/Ceam/CeamOtRoster';
import Login from './Pages/Login/Login';

setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.86/dist/');
function App() {
  return (
    <div>
      <Routes>
        <Route   exact
          path="/"
          element={
            localStorage.getItem('token') ? (
              <CeamRoster />
            ) : (
              <Navigate replace to="/login" />
            )
          }>
        </Route>
        <Route   exact
          path="/login"
          element={
              <Login/>
          }>
        </Route>
        <Route   exact
          path="/ot-roster"
          element={
            localStorage.getItem('token') ? (
              <CeamOtRoster />
            ) : (
              <Navigate replace to="/login" />
            )
          }>
        </Route>
      </Routes>
      
    </div>
  );
}

export default App;
