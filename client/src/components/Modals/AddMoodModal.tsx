import { Modal } from "../../ui/Modal";
import { Button } from "../../ui/Button";
import { Stepper } from "../../ui/Stepper";
import { TagCheckbox } from "../../ui/TagCheckbox";
import { TagRadioGroup } from "../../ui/TagRadio";

import VeryHappyEmoji from "../../assets/icons/icon-very-happy-color.svg";
import VerySadEmoji from "../../assets/icons/icon-very-sad-color.svg";
import NeutralEmoji from "../../assets/icons/icon-neutral-color.svg";
import HappyEmoji from "../../assets/icons/icon-happy-color.svg";
import SadEmoji from "../../assets/icons/icon-sad-color.svg";
import { useEffect, useRef, useState } from "react";
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

const STEP_TITLES = [
  "How was your mood today?",
  "How did you feel?",
  "Write about your day...",
  "How many hours did you sleep last night?",
];

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
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFirstStep = useRef(true);

  // Each step swaps the content under the Continue button, so move focus to
  // the new question: screen readers then read it and keyboard users start there.
  useEffect(() => {
    if (!isOpen) {
      isFirstStep.current = true;
      return;
    }
    if (isFirstStep.current) {
      isFirstStep.current = false;
      return; // Headless UI focuses the dialog on open
    }
    headingRef.current?.focus();
  }, [currentStep, isOpen]);

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

  const stepHeading = (
    <h3
      id="step-heading"
      ref={headingRef}
      tabIndex={-1}
      className="text-preset-3 outline-none"
    >
      {STEP_TITLES[currentStep - 1]}
    </h3>
  );

  return (
    <>
      <Modal open={isOpen} onClose={onClose} title="Log your mood">
        <div className="flex flex-col items-start gap-400">
          <Stepper
            steps={totalSteps}
            currentStep={currentStep}
            className="w-full"
          />

          <p role="status" className="sr-only">
            {`Step ${currentStep} of ${totalSteps}`}
          </p>

          {currentStep === 1 && (
            <div className="flex w-full flex-col items-start gap-400">
              {stepHeading}

              <TagRadioGroup
                aria-labelledby="step-heading"
                value={mood}
                onChange={setMood}
                options={MOODS.map((m) => ({
                  value: m.value,
                  label: m.label,
                  icon: (
                    <img src={m.icon} alt="" className="ml-auto h-auto w-9.5" />
                  ),
                }))}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="flex flex-col items-start gap-400">
              <div>
                {stepHeading}
                <p
                  id="feelings-hint"
                  className="text-preset-6 text-neutral-600"
                >
                  Select up to three tags: {feelings.length} of {MAX_FEELINGS}{" "}
                  selected.
                </p>
              </div>

              <div
                role="group"
                aria-labelledby="step-heading"
                aria-describedby="feelings-hint"
                className="flex w-full flex-wrap gap-150"
              >
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
              {stepHeading}

              <textarea
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
                maxLength={2000}
                aria-labelledby="step-heading"
                aria-describedby="journal-count"
                className="rounded-10 min-h-37.5 w-full border border-neutral-400 p-200 focus-visible:ring-2 focus-visible:ring-blue-600"
              ></textarea>
              <p id="journal-count" className="text-preset-7 text-neutral-600">
                {journal.length} of 2000 characters
              </p>
            </div>
          )}

          {currentStep === 4 && (
            <div className="flex flex-col items-start gap-400">
              {stepHeading}

              <TagRadioGroup
                aria-labelledby="step-heading"
                value={sleepHours}
                onChange={setSleepHours}
                options={SLEEP}
              />
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
