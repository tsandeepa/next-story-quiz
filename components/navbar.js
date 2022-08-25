import Link from "next/link";

const Navbar = () => {
  return (
    <div className="nav">
      <ul>
        <li><Link href={'/'}>Home</Link></li>
        <li><Link href={'/qz'}>Questions</Link></li>
      </ul>
    </div>
  );
}

export default Navbar;