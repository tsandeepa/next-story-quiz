import Navbar from "./navbar";

const Layout = ({ children }) => {
  return (
    <div className="container">
      <Navbar />
      {children}
    </div>
  );
}

export default Layout;