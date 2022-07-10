import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./Student/Home";
import { Dash }  from "./Student/Dash"
import { Login }  from "./Student/auth/Login"
import {SpecificLOR} from  "./Student/SpecificLOR"
import { Register } from './Student/auth/Register';
import {Profile} from './Student/Profile'
import {PasswordReset} from  './Student/auth/PasswordReset'
import { RecLoginPortal } from './Recommender/RecLoginPortal';
import { RecDash } from './Recommender/RecDash';
import { Saved } from './Student/Saved';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dash />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/lor" element={<SpecificLOR />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reset" element={<PasswordReset />} />
        <Route path="/recportal" element={<RecLoginPortal />} />
        <Route path="/recdashboard" element={<RecDash />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
