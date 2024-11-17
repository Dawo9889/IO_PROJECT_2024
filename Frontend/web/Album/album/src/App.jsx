import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyAlbum from "./Components/MyAlbum/MyAlbum"
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import Home from './Components/Home/Home';
import Layout from './Components/Other/Layout';
import Admin from './Components/Admin/Admin';
import Missing from './Components/Other/Missing';
import Unauthorized from './Components/Other/Unauthorized';
import LinkPage from './Components/Dashboard/LinkPage';
import Weddings from "./Components/Weddings/Weddings";
import PrivateRoute from './Components/AuthMechanizm/PrivateRoute'

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
            <Route path="album" element={<PrivateRoute element={<MyAlbum />} />} />
            <Route path="admin" element={<PrivateRoute element={<Admin />} />} />
            <Route path="weddings" element={<PrivateRoute element={<Weddings />} />} />
  
          {/* catch all */}
          <Route path="*" element={<Missing />} />
        </Route>
     </Routes>
    );
  }
export default App;