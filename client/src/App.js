import {  BrowserRouter as Router, Routes,  Route} from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PolicyPage from "./pages/PolicyPage";
import PageNotFount from "./pages/PageNotFount";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/User/Dashboard";
import PrivateRoute from "./components/Routes/Private";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import AdminRoute from "./components/Routes/AdminRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element = {<HomePage/>}></Route>
          
          <Route path="/dashboard" element = {<PrivateRoute/>}>
            <Route exact path="user" element = {<Dashboard/>}></Route>
          </Route>

          <Route path="/dashboard" element= {<AdminRoute/>}>
            <Route exact path="admin" element = {<AdminDashboard/>}/>
          </Route>
          
          <Route exact path="/about" element = {<AboutPage/>}></Route>
          <Route exact path="/register" element = {<Register/>}></Route>
          <Route exact path="/login" element = {<Login/>}></Route>
          <Route exact path="/forgot-password" element = {<ForgotPassword/>}></Route>
          <Route exact path="/contact" element = {<ContactPage/>}></Route>
          <Route exact path="/policy" element = {<PolicyPage/>}></Route>
          <Route path="*" element = {<PageNotFount/>}></Route>
        </Routes>

      </Router>
      
    </>
  );
}

export default App;
