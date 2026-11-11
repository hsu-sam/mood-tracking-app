import { NavLink } from "react-router";
import Logo from "../../assets/icons/logo.svg";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { useForm, type SubmitHandler } from "react-hook-form";

type FormFields = {
  email: string;
};

function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    console.log(data);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-400 px-200 md:gap-600 md:px-500">
      <img src={Logo} alt="Mood Tracker" className="h-600" />
      <div className="bg-neutral-0 rounded-16 flex flex-col gap-400 px-250 py-500 md:w-132.5 md:px-400">
        <div className="flex flex-col gap-100">
          <h3>Forgot your Password?</h3>
          <p className="text-preset-6-regular text-neutral-600">
            Enter your email address to reset your password.
          </p>
        </div>

        <form
          className="flex flex-col gap-400"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <Input
            label="Email address"
            placeholder="name@mail.com"
            type="email"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email format.",
              },
            })}
          />

          <div className="flex flex-col items-center gap-250">
            <Button variant="primary" type="submit" className="w-full">
              Send Reset Link
            </Button>

            <NavLink
              to="/login"
              className="text-preset-6-regular text-neutral-600"
            >
              Back to Log in.
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
