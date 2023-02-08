import './App.css';
import { BrowserRouter,Routes,Route} from "react-router-dom";
import Header from './components/Header/Header';
import Login from './components/Login/Login.jsx';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './Actions/User';
import Home from "./components/Home/Home.jsx"
import Account from './components/Account/Account';
import NewPost from './components/NewPost/NewPost';
import Register from './components/Register/Register';
import UpdateProfile from './components/UpdateProfile/UpdateProfile';
import UpdatePassword from "./components/UpdatePassword/UpdatePassword";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import UserProfile from "./components/UserProfile/UserProfile.jsx";
import Search from "./components/Search/Search.jsx";
// import NotFound from "./components/NotFound/NotFound.jsx";

export const  backend = {
  link: `http://localhost:4000`
}


function App() {
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(loadUser());
  },[dispatch]);

  const {isAuthenticated} = useSelector((state)=> state.user)
  return( 

      <BrowserRouter>
      {
        isAuthenticated && <Header/>

      }
        <Routes>
          <Route path="/" element={isAuthenticated?(<Home/>):(<Login/>)}/>
        </Routes>
        <Routes>
          <Route path="/account" element={isAuthenticated?(<Account/>):(<Login/>)}/>
        </Routes>
        <Routes>
          <Route path="/newpost" element={isAuthenticated?(<NewPost/>):(<Login/>)}/>
          <Route
          path="/register"
          element={isAuthenticated ? <Account /> : <Register />}
        ></Route>
         <Route
          path="/update/profile"
          element={isAuthenticated ? <UpdateProfile/> : <Register />}
        ></Route>
         <Route
          path="/update/password"
          element={isAuthenticated ? <UpdatePassword/> : <Register />}
        ></Route>
         <Route
          path="/forgot/password"
          element={isAuthenticated ? <UpdatePassword /> : <ForgotPassword />}
        />
        <Route
          path="/password/reset/:token"
          element={isAuthenticated ? <UpdatePassword /> : <ResetPassword />}
        />
        <Route
          path="/user/:id"
          element={isAuthenticated ? <UserProfile /> : <Login />}
        />

        <Route path="search" element={<Search />} />

        {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
       
      </BrowserRouter>

  );

}

export default App;
