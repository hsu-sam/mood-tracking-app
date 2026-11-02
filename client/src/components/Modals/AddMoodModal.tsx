import { Modal } from "../../ui/Modal";
import { Button } from "../../ui/Button";
import { Stepper } from "../../ui/Stepper";
import { TagCheckbox } from "../../ui/TagCheckbox";

import VeryHappyEmoji from "../../assets/icons/icon-very-happy-color.svg";
import VerySadEmoji from "../../assets/icons/icon-very-sad-color.svg";
import NeutralEmoji from "../../assets/icons/icon-neutral-color.svg";
import HappyEmoji from "../../assets/icons/icon-happy-color.svg";
import SadEmoji from "../../assets/icons/icon-sad-color.svg";
import { useState } from "react";

interface AddMoodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddMoodModal({ isOpen, onClose }: AddMoodModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  return (
    <>
      <Modal open={isOpen} onClose={onClose} title="Log your mood">
        <div className="flex flex-col items-start gap-400">
          <Stepper
            steps={totalSteps}
            currentStep={currentStep}
            className="w-full"
          />

          {currentStep === 1 && (
            <div className="flex flex-col items-start gap-400">
              <p className="text-preset-3">How was your mood today?</p>

              <div className="flex w-full flex-col gap-150">
                <TagCheckbox label="Very Happy" className="w-full">
                  <img
                    src={VeryHappyEmoji}
                    alt=""
                    className="ml-auto h-auto w-9.5"
                  />
                </TagCheckbox>

                <TagCheckbox label="Happy" className="w-full">
                  <img
                    src={HappyEmoji}
                    alt=""
                    className="ml-auto h-auto w-9.5"
                  />
                </TagCheckbox>

                <TagCheckbox label="Neutral" className="w-full">
                  <img
                    src={NeutralEmoji}
                    alt=""
                    className="ml-auto h-auto w-9.5"
                  />
                </TagCheckbox>

                <TagCheckbox label="Sad" className="w-full">
                  <img src={SadEmoji} alt="" className="ml-auto h-auto w-9.5" />
                </TagCheckbox>

                <TagCheckbox label="Very Sad" className="w-full">
                  <img
                    src={VerySadEmoji}
                    alt=""
                    className="ml-auto h-auto w-9.5"
                  />
                </TagCheckbox>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="flex flex-col items-start gap-400">
              <div>
                <p className="text-preset-3">How did you feel?</p>
                <p className="text-preset-6 text-neutral-600">
                  Select up to three tags:
                </p>
              </div>

              <div className="flex w-full flex-wrap gap-150">
                <TagCheckbox label="Joyful" />
                <TagCheckbox label="Down" />
                <TagCheckbox label="Anxious" />
                <TagCheckbox label="Calm" />
                <TagCheckbox label="Excited" />
                <TagCheckbox label="Frustrated" />
                <TagCheckbox label="Grateful" />
                <TagCheckbox label="Overwhelmed" />
                <TagCheckbox label="Motivated" />
                <TagCheckbox label="Irritable" />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="flex flex-col items-start gap-400">
              <p className="text-preset-3">Write about your day...</p>

              <textarea
                name=""
                id=""
                className="min-h-37.5 w-full border border-neutral-900"
              ></textarea>
            </div>
          )}

          {currentStep === 4 && (
            <div className="flex flex-col items-start gap-400">
              <p className="text-preset-3">
                How many hours did you sleep last night?
              </p>

              <div className="flex w-full flex-col gap-150">
                <TagCheckbox label="9+ hours" className="w-full" />
                <TagCheckbox label="7-8 hours" className="w-full" />
                <TagCheckbox label="5-6 hours" className="w-full" />
                <TagCheckbox label="3-4 hours" className="w-full" />
                <TagCheckbox label="0-2 hours" className="w-full" />
              </div>
            </div>
          )}

          <Button
            onClick={() =>
              currentStep === totalSteps
                ? onClose()
                : setCurrentStep((step) => step + 1)
            }
            className="w-full"
          >
            {currentStep === totalSteps ? "Submit" : "Continue"}
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default AddMoodModal;
