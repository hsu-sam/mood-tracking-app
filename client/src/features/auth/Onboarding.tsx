import Logo from "../../assets/icons/logo.svg";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";

import Avatar from "../../assets/images/avatar-lisa.jpg";
import { useForm, type SubmitHandler } from "react-hook-form";

type FormFields = {
  fullName: string;
};

function Onboarding() {
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
      <div className="bg-neutral-0 rounded-16 flex flex-col gap-400 px-250 py-500 md:px-400">
        <div className="flex flex-col gap-100">
          <h3>Personalize your experience</h3>
          <p className="text-preset-6-regular text-neutral-600">
            Add your name and a profile picture to make Mood yours.
          </p>
        </div>

        <form
          className="flex flex-col gap-300"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <Input
            label="Name"
            placeholder="Lisa Maria"
            error={errors.fullName?.message}
            {...register("fullName", {
              required: "Name is required.",
              validate: (value) =>
                value.trim().length > 0 || "Name cannot be blank.",
            })}
          />
          <div>
            <div className="flex items-start gap-250">
              <img
                src={Avatar}
                alt=""
                className="h-auto w-[64px] rounded-full"
              />
              <div className="gap-075 flex flex-col items-start">
                <p className="text-preset-6-regular">Upload Image</p>
                <p className="text-preset-7 text-neutral-600">
                  Max 250KB, PNG or JPEG
                </p>
                <Button variant="secondary" size="sm">
                  Upload
                </Button>
              </div>
            </div>
          </div>
          <Button type="submit">Start Tracking</Button>
        </form>
      </div>
    </div>
  );
}

export default Onboarding;
