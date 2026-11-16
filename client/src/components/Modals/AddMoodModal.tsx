import { Modal } from "../../ui/Modal";
import { Button } from "../../ui/Button";
import { Stepper } from "../../ui/Stepper";
import { TagCheckbox } from "../../ui/TagCheckbox";

import VeryHappyEmoji from "../../assets/icons/icon-very-happy-color.svg";
import VerySadEmoji from "../../assets/icons/icon-very-sad-color.svg";
import NeutralEmoji from "../../assets/icons/icon-neutral-color.svg";
import HappyEmoji from "../../assets/icons/icon-happy-color.svg";
import SadEmoji from "../../assets/icons/icon-sad-color.svg";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { localDate, useCreateMood } from "../../hooks/useMood";
import { getErrorMessage } from "../../services/getErrorMessage";
import type { MoodValue, SleepValue } from "../../types/mood";

const MOODS: { label: string; value: MoodValue; icon: string }[] = [
  { label: "Very Happy", value: 2, icon: VeryHappyEmoji },
  { label: "Happy", value: 1, icon: HappyEmoji },
  { label: "Neutral", value: 0, icon: NeutralEmoji },
  { label: "Sad", value: -1, icon: SadEmoji },
  { label: "Very Sad", value: -2, icon: VerySadEmoji },
];

const FEELINGS = [
  "Joyful",
  "Down",
  "Anxious",
  "Calm",
  "Excited",
  "Frustrated",
  "Grateful",
  "Overwhelmed",
  "Motivated",
  "Irritable",
];

const SLEEP: { label: string; value: SleepValue }[] = [
  { label: "9+ hours", value: 9 },
  { label: "7-8 hours", value: 7.5 },
  { label: "5-6 hours", value: 5.5 },
  { label: "3-4 hours", value: 3.5 },
  { label: "0-2 hours", value: 1 },
];

const MAX_FEELINGS = 3;

interface AddMoodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddMoodModal({ isOpen, onClose }: AddMoodModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const { mutate, isPending } = useCreateMood();

  const [mood, setMood] = useState<MoodValue | null>(null);
  const [feelings, setFeelings] = useState<string[]>([]);
  const [journal, setJournal] = useState("");
  const [sleepHours, setSleepHours] = useState<SleepValue | null>(null);

  // Start fresh every time the modal opens
  useEffect(() => {
    if (!isOpen) return;
    setCurrentStep(1);
    setMood(null);
    setFeelings([]);
    setJournal("");
    setSleepHours(null);
  }, [isOpen]);

  const toggleFeeling = (f: string, checked: boolean) =>
    setFeelings((prev) =>
      checked
        ? prev.length < MAX_FEELINGS
          ? [...prev, f]
          : prev
        : prev.filter((x) => x !== f),
    );

  const canContinue =
    (currentStep === 1 && mood !== null) ||
    (currentStep === 2 && feelings.length >= 1) ||
    (currentStep === 3 && journal.trim().length > 0) ||
    (currentStep === 4 && sleepHours !== null);

  const handleNext = () => {
    if (currentStep < totalSteps) return setCurrentStep((s) => s + 1);
    if (mood === null || sleepHours === null) return;

    mutate(
      {
        entryDate: localDate(),
        mood,
        feelings,
        sleepHours,
        journal: journal.trim(),
      },
      {
        onSuccess: () => {
          toast.success("Mood logged");
          onClose();
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  };

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
                {MOODS.map((m) => (
                  <TagCheckbox
                    key={m.value}
                    label={m.label}
                    className="w-full"
                    checked={mood === m.value}
                    onChange={() => setMood(m.value)}
                  >
                    <img src={m.icon} alt="" className="ml-auto h-auto w-9.5" />
                  </TagCheckbox>
                ))}
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
                {FEELINGS.map((f) => (
                  <TagCheckbox
                    key={f}
                    label={f}
                    checked={feelings.includes(f)}
                    disabled={
                      !feelings.includes(f) && feelings.length >= MAX_FEELINGS
                    }
                    onChange={(checked) => toggleFeeling(f, checked)}
                  />
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="flex flex-col items-start gap-400">
              <p className="text-preset-3">Write about your day...</p>

              <textarea
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
                maxLength={2000}
                aria-label="Journal entry"
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
                {SLEEP.map((o) => (
                  <TagCheckbox
                    key={o.value}
                    label={o.label}
                    className="w-full"
                    checked={sleepHours === o.value}
                    onChange={() => setSleepHours(o.value)}
                  />
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={handleNext}
            disabled={!canContinue}
            isLoading={isPending}
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
