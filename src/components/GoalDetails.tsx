import { useState } from "react";
import { useAuth } from "@/utils/firebase-auth";
import { useUserData, updateUserData } from "@/utils/firebase-firestore";
import { Dialog, RadioGroup, Disclosure, Transition } from "@headlessui/react";
import { Check, ChevronDown, ChevronUp, RotateCcw, X } from "react-feather";
import ProgressBar from "./ProgressBar";
import RadioGroupOption from "./RadioGroupOption";
import Button from "./Button";
import { getLocalStorage, updateLocalSettings } from "@/utils/localStorage";

interface Props {
  toggleDetails: () => void;
  isDetailsOpen: boolean;
  goal: Goal;
  progress: number;
  increment: (amount?: number | undefined) => void;
  reset: () => void;
  overflow: boolean;
}

const fractionsMap = new Map([
  [0.25, "¼"],
  [0.5, "½"],
  [0.75, "¾"],
  [1, "1"],
]);

const parseQuantity = (quantity: number | string) => {
  if (typeof quantity === "number") {
    let remainder = quantity % 1;
    if (fractionsMap.has(quantity)) {
      return fractionsMap.get(quantity);
    } else if (remainder !== 1 && fractionsMap.has(remainder)) {
      return `${Math.floor(quantity)} ${fractionsMap.get(remainder)}`;
    }
  }
  return quantity;
};

let localData: UserData | null = null;
getLocalStorage("herbivorous").then((result) => {
  localData = result;
});

export default function GoalDetails({
  toggleDetails,
  isDetailsOpen,
  goal,
  progress,
  increment,
  reset,
  overflow,
}: Props) {
  let { user } = useAuth();
  let { userData } = useUserData();

  const [units, setUnits] = useState(
    userData?.settings?.units || localData?.settings?.units || "metric",
  );
  const handleChangeUnits = (newValue: "metric" | "imperial") => {
    if (user) {
      updateUserData(user.uid, { settings: { units: newValue } });
    } else {
      updateLocalSettings({ units: newValue });
    }
    setUnits(newValue);
  };

  return (
    <>
      <Dialog open={isDetailsOpen} onClose={() => toggleDetails()}>
        <div
          className="fixed inset-0 bg-b-low opacity-40 z-30"
          aria-hidden="true"
        />
        <Dialog.Panel>
          <div className="fixed z-40 border-border border-2 bg-b-med inset-[10%] rounded-xl pt-8 px-8 shadow-lg shadow-b-low overflow-y-auto">
            <button
              className="z-50 absolute top-8 right-8 text-f-low hover:text-f-high"
              aria-label="close details"
              onClick={toggleDetails}
            >
              <X />
            </button>
            {/* margin-bottom affects entire menu content */}
            <div className="relative w-full mb-8">
              {/* header section */}
              <div className="mb-8">
                <Dialog.Title className="mb-1 text-xl font-bold first-letter:capitalize">
                  {goal.name}
                </Dialog.Title>
                <div className="text-f-med mb-4 text-sm flex flex-row items-center ">
                  Progress: {progress} / {goal.quantity}
                  <span className="pl-2 text-f-high">
                    {progress >= goal.quantity && <Check size={16} />}
                  </span>
                </div>
                <div className="w-full h-3">
                  <ProgressBar
                    goal={goal}
                    progress={progress}
                    overflow={overflow}
                  />
                </div>
              </div>
              <h3 className="font-bold text-sm mb-4">Log progess (servings)</h3>
              <div className="mb-8 flex flex-col sm:flex-row sm:justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {Array.from(fractionsMap.entries()).map((entry) => (
                    <Button key={entry[0]} onClick={() => increment(entry[0])}>
                      + {entry[1]}
                    </Button>
                  ))}
                  {progress < goal.quantity &&
                  !fractionsMap.has(goal.quantity - progress) ? (
                    <Button onClick={() => increment(goal.quantity - progress)}>
                      All (+ {parseQuantity(goal.quantity - progress)})
                    </Button>
                  ) : (
                    ""
                  )}
                </div>
                <Button
                  onClick={() => reset()}
                  classes="flex flex-row gap-2 w-min"
                >
                  <RotateCcw size={14} /> <span>Reset</span>
                </Button>
              </div>
              <h3 className="font-bold text-sm mb-4">Units</h3>
              <RadioGroup
                value={units}
                onChange={(newValue) => handleChangeUnits(newValue)}
              >
                <RadioGroup.Label className="sr-only">Units</RadioGroup.Label>
                <div className="mb-8 flex flex-row">
                  <RadioGroupOption value="metric">
                    <RadioGroup.Label>Metric</RadioGroup.Label>
                  </RadioGroupOption>
                  <RadioGroupOption value="imperial">
                    <RadioGroup.Label>Imperial</RadioGroup.Label>
                  </RadioGroupOption>
                </div>
              </RadioGroup>
              <h3 className="font-bold text-sm mb-4">Suggestions</h3>
              <ul className="text-sm mb-8">
                {goal.suggestions.map((suggestion: Suggestion) => (
                  <li key={suggestion.name} className="mb-2">
                    {parseQuantity(suggestion.portion[units].quantity)}{" "}
                    {suggestion.portion[units].unit} {suggestion.name}{" "}
                  </li>
                ))}
                <li></li>
              </ul>
              <div className="mb-8 w-full rounded-xl -mx-2 p-2 border-2 border-border">
                <Disclosure defaultOpen={true}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="font-bold text-sm flex flex-row items-center gap-2 w-full justify-between p-2 hover:bg-b-med rounded-lg">
                        <span>Types</span>
                        {open ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </Disclosure.Button>
                      <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                      >
                        <Disclosure.Panel className="text-sm px-2 w-full mt-2">
                          <ul>
                            {goal.types?.map((type: string) => (
                              <li
                                key={type}
                                className="first-letter:capitalize mb-2"
                              >
                                {type}
                              </li>
                            ))}
                          </ul>
                        </Disclosure.Panel>
                      </Transition>
                    </>
                  )}
                </Disclosure>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}
