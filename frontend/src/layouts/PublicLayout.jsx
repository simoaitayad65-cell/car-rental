import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/home/Footer";

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
