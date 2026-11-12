import { DropdownMenu } from "./DropdownMenu";
import Logo from "../assets/icons/logo.svg";
import AvatarPlaceholder from "../assets/icons/avatar-placeholder.svg";
import { useUser } from "../features/auth/useUser";
import { useLogout } from "../hooks/useAuth";

function Header() {
  const { user } = useUser();
  const { mutate: logout } = useLogout();

  return (
    <header className="flex items-center justify-between">
      <img src={Logo} alt="Logo" />

      <DropdownMenu
        name={user?.fullName ?? ""}
        email={user?.email ?? ""}
        avatarSrc={user?.photo ?? AvatarPlaceholder}
        onLogout={() => logout()}
      />
    </header>
  );
}

export default Header;
