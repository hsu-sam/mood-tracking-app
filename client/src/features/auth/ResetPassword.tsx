import Logo from "../../assets/icons/logo.svg";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { useForm, type SubmitHandler } from "react-hook-form";

type FormFields = {
  password: string;
  passwordConfirm: string;
};

function ResetPassword() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormFields>();
  const password = watch("password");

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    console.log(data);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-400 px-200 md:gap-600 md:px-500">
      <img src={Logo} alt="Mood Tracker" className="h-600" />
      <div className="bg-neutral-0 rounded-16 flex flex-col gap-400 px-250 py-500 md:w-132.5 md:px-400">
        <div className="flex flex-col gap-100">
          <h3>Reset your Password?</h3>
          <p className="text-preset-6-regular text-neutral-600">
            Enter your new your password.
          </p>
        </div>

        <form
          className="flex flex-col gap-400"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="flex flex-col gap-250">
            <Input
              label="New password"
              placeholder=""
              type="password"
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required.",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters.",
                },
              })}
            />
            <Input
              label="Confirm password"
              placeholder=""
              type="password"
              error={errors.passwordConfirm?.message}
              {...register("passwordConfirm", {
                required: "Please confirm your password.",
                validate: (value) =>
                  value === password || "Passwords do not match.",
              })}
            />
          </div>

          <div className="flex flex-col items-center gap-250">
            <Button variant="primary" type="submit" className="w-full">
              Reset Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
