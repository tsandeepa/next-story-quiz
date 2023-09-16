import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="flex justify-center items-center  px-12 py-3">
      {/* <img src="/logo.png" style={{ 'width': '200px' }} alt="" /> */}
      <ul className="flex gap-5 text-white">
        <li><Link href={'/'}>Home</Link></li>
        <li><Link href={'/qz'}>Groups</Link></li>
      </ul>
    </div>
  );
}

export default Navbar;