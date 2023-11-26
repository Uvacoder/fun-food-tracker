"use client";

import { useState } from "react";
import NeedsItemDetails from "./NeedsItemDetails";
import ProgressBar from "./ProgressBar";
import { Check, Plus } from "react-feather";

interface Props {
  need: Need;
}

export default function NeedsItem({ need }: Props) {
  const [progress, setProgress] = useState(0);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  let [progressOverflow, setProgressOverflow] = useState(false);

  const incrementProgress = (amount: number) => {
    if (progress >= need.goal) {
      setProgressOverflow(true);
      setTimeout(() => {
        setProgressOverflow(false);
      }, 100);
    }
    setProgress(progress + amount);
  };

  const resetProgress = () => {
    setProgress(0);
  };

  const toggleDetails = () => {
    setIsDetailsOpen(!isDetailsOpen);
  };

  return (
    <div className="flex flex-row justify-between items-center max-w-full text-f-high">
      <button
        className="h-20 w-full"
        aria-label="open item details"
        onClick={() => toggleDetails()}
      >
        <ProgressBar
          progress={progress}
          need={need}
          progressOverflow={progressOverflow}
          hoverable={true}
        >
          <div className="flex justify-between flex-row items-center w-full">
            <div className="flex flex-row items-center w-full">
              <div className="z-10 ml-6 font-bold first-letter:capitalize whitespace-nowrap truncate">
                {need.name}
              </div>
              <div className="z-10 ml-4 shrink-0">
                {progress} / {need.goal}
              </div>
            </div>
            <div className="p-8">{progress >= need.goal && <Check />}</div>
          </div>
        </ProgressBar>
      </button>

      <button
        onClick={() => incrementProgress(1)}
        aria-label="increase progress by 1"
        className="group ml-4 grid grid-rows-3 shrink-0 h-full relative justify-end place-items-center text-f-low hover:text-f-high"
      >
        <span className="row-start-2">
          <Plus />
        </span>
        <span className="row-start-3 w-full text-xs invisible group-hover:visible">
          Log 1
        </span>
      </button>

      {isDetailsOpen ? (
        <NeedsItemDetails
          toggleDetails={toggleDetails}
          incrementProgress={incrementProgress}
          isDetailsOpen={isDetailsOpen}
          resetProgress={resetProgress}
          progress={progress}
          need={need}
          progressOverflow={progressOverflow}
        />
      ) : (
        ""
      )}
    </div>
  );
}
