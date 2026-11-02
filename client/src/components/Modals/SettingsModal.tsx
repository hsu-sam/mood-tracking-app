import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { Modal } from "../../ui/Modal";

import Avatar from "../../assets/images/avatar-lisa.jpg";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function Settings({ isOpen, onClose }: SettingsModalProps) {
  return (
    <>
      <Modal
        open={isOpen}
        onClose={onClose}
        title="Update your profile"
        description="Personalize your account with your name and photo."
      >
        <div className="flex flex-col gap-300">
          <Input label="Name" placeholder="Lisa Maria" />
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
          <Button>Save changes</Button>
        </div>
      </Modal>
    </>
  );
}

export default Settings;
