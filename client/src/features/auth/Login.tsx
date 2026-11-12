import { NavLink, useNavigate } from "react-router";
import toast from "react-hot-toast";
import Logo from "../../assets/icons/logo.svg";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useLogin } from "../../hooks/useAuth";
import { getErrorMessage } from "../../services/getErrorMessage";

type FormFields = {
  email: string;
  password: string;
};

function Login() {
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    login(data, {
      onSuccess: () => {
        navigate("/home", { replace: true });
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-400 px-200 md:gap-600 md:px-500">
      <img src={Logo} alt="Mood Tracker" className="h-600" />
      <div className="bg-neutral-0 rounded-16 flex flex-col gap-400 px-250 py-500 md:w-132.5 md:px-400">
        <div className="flex flex-col gap-100">
          <h3>Welcome back!</h3>
          <p className="text-preset-6-regular text-neutral-600">
            Log in to continue tracking your mood and sleep.
          </p>
        </div>

        <form
          className="flex flex-col gap-400"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-250">
            <Input
              label="Email address"
              placeholder="name@mail.com"
              type="email"
              error={errors.email?.message}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format.",
                },
              })}
            />
            <Input
              label="Password"
              placeholder=""
              type="password"
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required",
              })}
            />
          </div>

          <div className="flex flex-col items-center gap-250">
            <Button
              variant="primary"
              type="submit"
              className="w-full"
              isLoading={isPending}
            >
              Log in
            </Button>

            <p className="text-preset-6-regular text-neutral-600">
              Haven't got an account?{" "}
              <NavLink to="/signup" className="text-blue-600">
                Sign up.
              </NavLink>
            </p>
          </div>
        </form>
        <NavLink
          to="/forgot-password"
          className="text-preset-6-regular text-center text-blue-600"
        >
          Forgot your password?
        </NavLink>
      </div>
    </div>
  );
}

export default Login;
