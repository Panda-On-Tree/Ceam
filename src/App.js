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
import CeamApprove from './Pages/CeamApprove/CeamApprove';
import CeamOtApprove from './Pages/CeamApprove/CeamOtApprove';
import Navbar from './Components/Navbar/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PlantManage from './Pages/ManagePlant/PlantManage';
setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.86/dist/');
function App() {

  
  const Dashboard = () => (
    <div >
      <Navbar />
      <div >
        <Outlet />
      </div>
      
    </div>
  )
  const Auth = () => (
    <div>
      <Outlet />
    </div>
  )

  return (
    <div>
      <Routes>
        <Route element={<Dashboard />}>
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
          path="/ot-roster"
          element={
            localStorage.getItem('token') ? (
              <CeamOtRoster />
            ) : (
              <Navigate replace to="/login" />
            )
          }>
        </Route>
        <Route   exact
          path="/roster-approve"
          element={
            localStorage.getItem('token') ? (
              <CeamApprove />
            ) : (
              <Navigate replace to="/login" />
            )
          }>
        </Route>
        <Route   exact
          path="/ot-roster-approve"
          element={
            localStorage.getItem('token') ? (
              <CeamOtApprove />
            ) : (
              <Navigate replace to="/login" />
            )
          }>
        </Route>
        <Route   exact
          path="/plant-manage"
          element={
            localStorage.getItem('token') ? (
              <PlantManage />
            ) : (
              <Navigate replace to="/login" />
            )
          }>
        </Route>
        </Route>
        <Route element={<Auth />}>
        <Route   exact
          path="/login"
          element={
              <Login/>
          }>
        </Route>
        </Route>
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
