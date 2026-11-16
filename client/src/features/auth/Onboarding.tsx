import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import Logo from "../../assets/icons/logo.svg";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";

import Avatar from "../../assets/images/avatar-lisa.jpg";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useOnboarding } from "../../hooks/useAuth";
import { getErrorMessage } from "../../services/getErrorMessage";

type FormFields = {
  fullName: string;
  photo?: string;
};

// Must match the server's multer limits.
const MAX_PHOTO_SIZE = 250 * 1024;
const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png"];

function Onboarding() {
  const navigate = useNavigate();
  const { mutate: onboard, isPending } = useOnboarding();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  // Free the preview's object URL when it changes or the page unmounts.
  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Reset so picking the same file again still fires onChange.
    event.target.value = "";
    if (!file) return;

    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      setPhotoError("Photo must be a PNG or JPEG image.");
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setPhotoError("Photo must not exceed 250KB.");
      return;
    }

    setPhotoError(null);
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const onSubmit: SubmitHandler<FormFields> = ({ fullName }) => {
    onboard(
      { fullName: fullName.trim(), photo },
      {
        onSuccess: () => {
          navigate("/home", { replace: true });
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      },
    );
  };

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex min-h-screen flex-col items-center justify-center gap-400 px-200 py-500 outline-none md:gap-600 md:px-500"
    >
      <img src={Logo} alt="Mood Tracker" className="h-600" />
      <div className="bg-neutral-0 rounded-16 flex flex-col gap-400 px-250 py-500 md:px-400">
        <div className="flex flex-col gap-100">
          <h1 className="text-preset-3">Personalize your experience</h1>
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
            autoComplete="name"
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
                src={photoPreview ?? Avatar}
                alt=""
                className="size-[64px] rounded-full object-cover"
              />
              <div className="gap-075 flex flex-col items-start">
                <p className="text-preset-6-regular">Upload Image</p>
                <p className="text-preset-7 text-neutral-600">
                  Max 250KB, PNG or JPEG
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  aria-label="Upload profile photo"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload
                </Button>
                <p role="status" className="sr-only">
                  {photo ? `Selected photo: ${photo.name}` : ""}
                </p>
                {photoError && (
                  <p role="alert" className="text-preset-7 text-red-700">
                    {photoError}
                  </p>
                )}
              </div>
            </div>
          </div>
          <Button type="submit" isLoading={isPending}>
            Start Tracking
          </Button>
        </form>
      </div>
    </main>
  );
}

export default Onboarding;
