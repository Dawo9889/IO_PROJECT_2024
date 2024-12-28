import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import MyAlbum from "./Components/MyAlbum/MyAlbum"
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import Home from './Components/Home/Home';
import Layout from './Components/Other/Layout';
import Admin from './Components/Admin/Admin';
import Missing from './Components/Other/Missing';
import Team from './Components/Other/Team';
import Unauthorized from './Components/Other/Unauthorized';
import LinkPage from './Components/Dashboard/LinkPage';
import Weddings from "./Components/Weddings/Weddings";
import PrivateRoute from './Components/AuthMechanizm/PrivateRoute'
import CreateWedding from "./Components/Weddings/createWedding";
import WeddingsGallery from "./Components/Weddings/WeddingsGallery";
import { ToastContainer } from "react-toastify";
function App() {

    return (
      <>
    <ToastContainer />
     <Routes>
         <Route path="/" element={<div className="h-dvh flex flex-col bg-project-dark"><Layout /></div>}>

          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="team" element={<Team />} />
          <Route path="linkpage" element={<LinkPage />} />
          <Route path="unauthorized" element={<Unauthorized />} />
  
            <Route path="/" element={<div className="p-4"><Home /></div>} />
            <Route path="album" element={<PrivateRoute element={<MyAlbum />} />} />
            <Route path="admin" element={<PrivateRoute element={<Admin />} />} />
            <Route path="weddings" element={<PrivateRoute element={<Weddings />} />} />
            <Route path="createWedding" element={<PrivateRoute element={<CreateWedding />} />} />
            <Route path="weddingsGallery" element={<PrivateRoute element={<WeddingsGallery />} />} />
  
          <Route path="*" element={<Missing />} />
        </Route>
     </Routes>
     </>
    );
  }
export default App;