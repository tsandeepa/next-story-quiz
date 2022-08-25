import Navbar from "./navbar";

const Layout = ({ children }) => {
  return (
    <div className="container mx-auto max-w-3xl" >
      <Navbar />
      {children}
    </div>
  );
}

export default Layout;