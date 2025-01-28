import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyAlbum from "./Components/MyAlbum/MyAlbum"
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import Home from './Components/Home/Home';
import Layout from './Components/Other/Layout';
import Admin from './Components/Admin/Admin';
import Missing from './Components/Other/Missing';
import Team from './Components/Other/Team';
import Unauthorized from './Components/Other/Unauthorized';
import Weddings from "./Components/Weddings/Weddings";
import PrivateRoute from './Components/AuthMechanizm/PrivateRoute'
import CreateWedding from "./Components/Weddings/createWedding";
import WeddingsGallery from "./Components/WeddingGallery/WeddingsGallery";
import Settings from "./Components/Settings/Settings";
import ResetPassword from "./Components/ResetPassword/ResetPassword";
import SettingsChangePassword from "./Components/Settings/SettingsChangePassword";
import ResetPasswordForm from "./Components/ResetPassword/ResetPasswordForm";
import SettingsModifyProfileImage from "./Components/Settings/SettingsModifyProfileImage";
import { ToastContainer } from "react-toastify";
import SettingsChangeMail from "./Components/Settings/SettingsChangeMail";
import PublicRoute from "./Components/AuthMechanizm/PublicRoute";
import Mobile from "./Components/Other/Mobile";
function App() {

    return (
      <>
        <ToastContainer />
          <Routes>
            <Route path="/" element={<div className="h-dvh flex flex-col bg-project-dark"><Layout /></div>}>
         
            <Route path="login" element={<PublicRoute element={<Login />} />} />
            <Route path="register" element={<PublicRoute element={<Register />} />} />
            <Route path="resetPassword" element={<PublicRoute element={<ResetPassword />} />} />
            <Route path="resetPasswordForm" element={<PublicRoute element={<ResetPasswordForm />} />} />
            <Route path="team" element={<Team />} />
            <Route path="mobile" element={<div className="p-4 bg-project-dark"><Mobile /></div>} />
            <Route path="unauthorized" element={<Unauthorized />} />
            <Route path="/" element={<div className="p-4 bg-project-dark"><Home /></div>} />
         
            <Route path="album" element={<PrivateRoute element={<MyAlbum />} />} />
            <Route path="admin" element={<PrivateRoute element={<Admin />} />} />
            <Route path="weddings" element={<PrivateRoute element={<Weddings />} />} />
            <Route path="createWedding" element={<PrivateRoute element={<CreateWedding />} />} />
            <Route path="weddingsGallery" element={<PrivateRoute element={<WeddingsGallery />} />} />
            <Route path="settings" element={<PrivateRoute element={<Settings />} />} />
            <Route path="settings/modifyprofileimage" element={<PrivateRoute element={<SettingsModifyProfileImage />} />} />
            <Route path="settings/changemail" element={<PrivateRoute element={<SettingsChangeMail />} />} />
            <Route path="settings/changepassword" element={<PrivateRoute element={<SettingsChangePassword />} />} />
         
            <Route path="*" element={<Missing />} />
          </Route>
          </Routes>
     </>
    );
  }
export default App;