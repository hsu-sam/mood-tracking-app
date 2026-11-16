import { NavLink } from "react-router";
import toast from "react-hot-toast";
import Logo from "../../assets/icons/logo.svg";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useForgotPassword } from "../../hooks/useAuth";
import { getErrorMessage } from "../../services/getErrorMessage";

type FormFields = {
  email: string;
};

function ForgotPassword() {
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    forgotPassword(data, {
      onSuccess: ({ message }) => {
        toast.success(message);
        reset();
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex min-h-screen flex-col items-center justify-center gap-400 px-200 py-500 outline-none md:gap-600 md:px-500"
    >
      <img src={Logo} alt="Mood Tracker" className="h-600" />
      <div className="bg-neutral-0 rounded-16 flex flex-col gap-400 px-250 py-500 md:w-132.5 md:px-400">
        <div className="flex flex-col gap-100">
          <h1 className="text-preset-3">Forgot your Password?</h1>
          <p className="text-preset-6-regular text-neutral-600 underline underline-offset-4">
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
            autoComplete="email"
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
            <Button
              variant="primary"
              type="submit"
              className="w-full"
              isLoading={isPending}
            >
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
    </main>
  );
}

export default ForgotPassword;
