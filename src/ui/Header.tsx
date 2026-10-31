import { DropdownMenu } from "./DropdownMenu";
import Logo from "../assets/icons/logo.svg";

function Header() {
  return (
    <header className="flex items-center justify-between">
      <img src={Logo} alt="Logo" />

      <DropdownMenu
        name="Lisa Maria"
        email="lisa@mail.com"
        avatarSrc="avatar-lisa.jpg"
      />
    </header>
  );
}

export default Header;
