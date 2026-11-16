import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import toast from "react-hot-toast";
import { useUpdateMe } from "../../hooks/useAuth";
import { useUser } from "../../features/auth/useUser";
import { getErrorMessage } from "../../services/getErrorMessage";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { Modal } from "../../ui/Modal";

import Avatar from "../../assets/images/avatar-lisa.jpg";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MAX_PHOTO_SIZE = 250 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg"];

function Settings({ isOpen, onClose }: SettingsModalProps) {
  const { user } = useUser();
  const { mutate, isPending } = useUpdateMe();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  // Reset the form from the current user each time the modal opens.
  useEffect(() => {
    if (isOpen) {
      setFullName(user?.fullName ?? "");
      setPhoto(null);
      setPhotoError(null);
    }
  }, [isOpen, user?.fullName]);

  // Create/revoke the object URL for the selected photo preview.
  useEffect(() => {
    if (!photo) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(photo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setPhotoError("Unsupported file type. Please upload a PNG or JPEG");
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setPhotoError("File is too large. Max size is 250KB");
      return;
    }
    setPhotoError(null);
    setPhoto(file);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = fullName.trim();
    if (!trimmed) return;

    mutate(
      {
        fullName: trimmed !== user?.fullName ? trimmed : undefined,
        photo,
      },
      {
        onSuccess: () => {
          toast.success("Profile updated");
          onClose();
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  };

  const avatarSrc =
    preview ??
    (user?.photo
      ? user.photo.startsWith("http")
        ? user.photo
        : `${(import.meta.env.VITE_API_URL ?? "").replace(/\/api\/?$/, "")}${user.photo}`
      : Avatar);

  return (
    <>
      <Modal
        open={isOpen}
        onClose={onClose}
        title="Update your profile"
        description="Personalize your account with your name and photo."
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-300">
          <Input
            label="Name"
            placeholder="Lisa Maria"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <div>
            <div className="flex items-start gap-250">
              <img
                src={avatarSrc}
                alt=""
                className="h-auto w-[64px] rounded-full"
              />
              <div className="flex flex-col gap-200">
                <div className="gap-075 flex flex-col items-start">
                  <p className="text-preset-6-regular">Upload Image</p>
                  <p className="text-preset-7 text-neutral-600">
                    Max 250KB, PNG or JPEG
                  </p>
                </div>

                <div className="flex flex-col gap-100">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-fit"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload
                  </Button>
                  {photoError && (
                    <div
                      role="alert"
                      className="text-preset-9 gap-075 flex items-center text-red-500"
                    >
                      <svg
                        aria-hidden="true"
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.8125 0.1875C9 0.1875 11.625 2.8125 11.625 6C11.625 9.21094 9 11.8125 5.8125 11.8125C2.60156 11.8125 0 9.21094 0 6C0 2.8125 2.60156 0.1875 5.8125 0.1875ZM5.8125 2.76562C5.25 2.76562 4.82812 3.21094 4.82812 3.75C4.82812 4.3125 5.25 4.73438 5.8125 4.73438C6.35156 4.73438 6.79688 4.3125 6.79688 3.75C6.79688 3.21094 6.35156 2.76562 5.8125 2.76562ZM7.125 8.71875V8.15625C7.125 8.01562 6.98438 7.875 6.84375 7.875H6.5625V5.53125C6.5625 5.39062 6.42188 5.25 6.28125 5.25H4.78125C4.61719 5.25 4.5 5.39062 4.5 5.53125V6.09375C4.5 6.25781 4.61719 6.375 4.78125 6.375H5.0625V7.875H4.78125C4.61719 7.875 4.5 8.01562 4.5 8.15625V8.71875C4.5 8.88281 4.61719 9 4.78125 9H6.84375C6.98438 9 7.125 8.88281 7.125 8.71875Z"
                          fill="#E60013"
                        />
                      </svg>
                      <p>{photoError}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Button type="submit" isLoading={isPending}>
            Save changes
          </Button>
        </form>
      </Modal>
    </>
  );
}

export default Settings;
