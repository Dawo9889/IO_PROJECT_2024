import Navbar from "./Components/Navbar/Navbar";
import {GiHamburgerMenu} from 'react-icons/gi'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyAlbum from "./MyAlbum/MyAlbum";
import { useState } from "react";
import "./App.css";
import Register from './Components/Navpages/Register';
import Login from './Components/Navpages/Login';
import Home from './Components/Navpages/Home';
import Layout from './Components/Navpages/Layout';
import Editor from './Components/Navpages/Editor';
import Admin from './Components/Navpages/Admin';
import Missing from './Components/Navpages/Missing';
import Unauthorized from './Components/Navpages/Unauthorized';
import Lounge from './Components/Navpages/Lounge';
import LinkPage from './Components/Navpages/LinkPage';
import RequireAuth from './Components/Navpages/RequireAuth';

function App() {
    return (
     <Routes>
         <Route path="/" element={<Layout />}>
          {/* public routes */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="linkpage" element={<LinkPage />} />
          <Route path="unauthorized" element={<Unauthorized />} />
  
          {/* we want to protect these routes */}
            <Route path="/" element={<Home />} />
            <Route path="album" element={<MyAlbum />} />
            <Route path="admin" element={<Admin />} />
            <Route path="lounge" element={<Lounge />} />
  
          {/* catch all */}
          <Route path="*" element={<Missing />} />
        </Route>
     </Routes>
    );
  }
export default App;