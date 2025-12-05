import "../src/dist/styles.css";
import About from "./Pages/About";
import Home from "./Pages/Home";
import AuthPage from "./Pages/AuthPage";
import Reserves from "./Pages/Reserves";
import AdminLogin from "./Pages/AdminLogin";
import AdminPage from "./Pages/AdminPage";
import Navbar from "../src/components/Navbar";
import { Route, Routes, useLocation  } from "react-router-dom";
import Models from "./Pages/Models";
import TestimonialsPage from "./Pages/TestimonialsPage";
import Team from "./Pages/Team";
import Contact from "./Pages/Contact";

function App() {
  const location = useLocation();
  const hideNavbarRoutes = ["/admin", "/admin/home"];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="models" element={<Models />} />
        <Route path="testimonials" element={<TestimonialsPage />} />
        <Route path="team" element={<Team />} />
        <Route path="contact" element={<Contact />} />
        <Route path="auth" element={<AuthPage />} />
        <Route path="Reserves" element={<Reserves />} />
        <Route path="admin" element={<AdminLogin />} />
        <Route path="admin/home" element={<AdminPage />} />
      </Routes>
    </>
  );
}

export default App;
