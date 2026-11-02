import { NavLink } from "react-router";
import Logo from "../../assets/icons/logo.svg";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";

function Signup() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-400 px-200 md:gap-600 md:px-500">
      <img src={Logo} alt="Mood Tracker" className="h-600" />
      <div className="bg-neutral-0 rounded-16 flex flex-col gap-400 px-250 py-500 md:w-132.5 md:px-400">
        <div className="flex flex-col gap-100">
          <h3>Create an account</h3>
          <p className="text-preset-6-regular text-neutral-600">
            Join to track your daily mood and sleep with ease.
          </p>
        </div>

        <form className="flex flex-col gap-400">
          <div className="flex flex-col gap-250">
            <Input label="Email address" placeholder="name@mail.com" />
            <Input label="Password" placeholder="" />
          </div>

          <div className="flex flex-col items-center gap-250">
            <Button variant="primary" type="submit" className="w-full">
              Log in
            </Button>

            <p className="text-preset-6-regular text-neutral-600">
              Already got an account?{" "}
              <NavLink to="/login" className="text-blue-600">
                Log in.
              </NavLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Signup;
