"use client";

import { useContext, useState } from "react";
import { UserContext } from "./UserProvider";
import GoalDetails from "./GoalDetails";
import ProgressBar from "./ProgressBar";
import { Check, Plus } from "react-feather";
import { useUserData, useProgress } from "@/utils/firebase-firestore";

interface Props {
  goal: Goal;
  date: string;
}

export default function Goal({ goal, date }: Props) {
  const { user } = useContext(UserContext);
  const { userData, isLoading } = useUserData();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { progress, increment, reset, overflow } = useProgress(
    user,
    goal,
    date,
  );

  const toggleDetails = () => {
    setIsDetailsOpen(!isDetailsOpen);
  };

  return (
    <div className="flex flex-col items-start justify-between max-w-full text-f-high ml-8 truncate">
      <div className="flex flex-row gap-4">
        <div className="font-bold first-letter:capitalize truncate max-w-full">
          {goal.name}
        </div>
        <div>
          {progress} / {goal.quantity}
        </div>
        <div className="ml-8">{progress >= goal.quantity && <Check />}</div>
      </div>
      <div className="flex flex-row w-full items-center">
        <ProgressBar
          progress={progress}
          goal={goal}
          overflow={overflow}
          hoverable={true}
        >
          <button
            className="h-12 w-full flex items-center justify-start z-10"
            aria-label="open item details"
            onClick={() => toggleDetails()}
          >
            <div className="ml-4 flex items-center z-10">
              <img
                className="h-8 w-8"
                src={`/goals/${goal.icons[0] ?? "beans"}${
                  userData?.settings?.themeVariant === "light" ? "-dark" : ""
                }.png`}
              />
            </div>
          </button>
        </ProgressBar>

        <button
          onClick={() => increment()}
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
      </div>

      {isDetailsOpen ? (
        <GoalDetails
          toggleDetails={toggleDetails}
          isDetailsOpen={isDetailsOpen}
          goal={goal}
          progress={progress}
          increment={increment}
          reset={reset}
          overflow={overflow}
        />
      ) : (
        ""
      )}
    </div>
  );
}
