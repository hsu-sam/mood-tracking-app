import Logo from "../../assets/icons/logo.svg";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";

import Avatar from "../../assets/images/avatar-lisa.jpg";

function Onboarding() {
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
          <Button>Start Tracking</Button>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
