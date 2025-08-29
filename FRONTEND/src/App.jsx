import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const location = useLocation();

  const showHeaderFooter =
    location.pathname !== "/login" &&
    location.pathname !== "/register" &&
    !location.pathname.startsWith("/admin");

  return (
    <>
      {showHeaderFooter && <Header />}
      <main className={showHeaderFooter ? "pt-14" : ""}>
        <Outlet />
      </main>
      {showHeaderFooter && <Footer />}
    </>
  );
}

export default App;
