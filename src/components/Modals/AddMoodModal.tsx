import { Modal } from "../../ui/Modal";
import { Button } from "../../ui/Button";
import { Stepper } from "../../ui/Stepper";
import { TagCheckbox } from "../../ui/TagCheckbox";

import HappyEmoji from "../../assets/icons/icon-very-happy-color.svg";
import SadEmoji from "../../assets/icons/icon-very-sad-color.svg";

interface AddMoodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddMoodModal({ isOpen, onClose }: AddMoodModalProps) {
  return (
    <>
      <Modal open={isOpen} onClose={onClose} title="Log your mood">
        <div className="flex flex-col items-start gap-400">
          <Stepper steps={4} currentStep={1} className="w-full" />

          <p className="text-preset-3">How was your mood today?</p>

          <div className="flex w-full flex-col gap-150">
            <TagCheckbox label="Very Happy" className="w-full">
              <img src={HappyEmoji} alt="" className="ml-auto h-auto w-9.5" />
            </TagCheckbox>

            <TagCheckbox label="Very Sad" className="w-full">
              <img src={SadEmoji} alt="" className="ml-auto h-auto w-9.5" />
            </TagCheckbox>
          </div>

          <Button onClick={onClose} className="w-full">
            Continue
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default AddMoodModal;
