import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { UserContextProvider } from "./context/UserContext";
import AdminDashBoard from "./pages/AdminDashBoard";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import StoreDashBoard from "./pages/StoreDashboard";
import UserDashBoard from "./pages/UserDashBoard";

function App() {
  return (
    <>
      <UserContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />}>
              <Route index element={<Dashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
        {/* <Login /> */}

        {/* <AdminDashBoard /> */}
        {/* <UserDashBoard/> */}
        {/* <StoreDashBoard/> */}
      </UserContextProvider>
    </>
  );
}

export default App;
