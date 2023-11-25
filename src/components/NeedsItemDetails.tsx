"use client";

import { useEffect } from "react";
import { Dialog, RadioGroup, Disclosure, Transition } from "@headlessui/react";
import useOptions from "../app/store";
import { Check, ChevronDown, ChevronUp, RotateCcw, X } from "react-feather";

import RadioGroupOption from "./RadioGroupOption";

import Button from "./Button";

interface Props {
  incrementProgress: (amount: number) => void;
  resetProgress: () => void;
  toggleDetails: () => void;
  isDetailsOpen: boolean;
  progress: number;
  need: any;
}

const fractionsMap = new Map([
  [0.25, "¼"],
  [0.5, "½"],
  [0.75, "¾"],
  [1, "1"],
]);

const parseNumberToString = (number: number) => {
  let remainder = number % 1;
  console.log("remainder", remainder);
  if (fractionsMap.has(number)) {
    return fractionsMap.get(number);
  } else if (remainder !== 1 && fractionsMap.has(remainder)) {
    return `${Math.floor(number)} ${fractionsMap.get(remainder)}`;
  } else {
    return number;
  }
};

export default function ItemEditMenu({
  incrementProgress,
  resetProgress,
  toggleDetails,
  isDetailsOpen,
  progress,
  need,
}: Props) {
  const [options, setOptions] = useOptions();

  useEffect(() => {
    console.log({ options, setOptions });
  }, [options]);

  const selectedUnits = options.units === "metric" ? "metric" : "imperial";

  return (
    <>
      <Dialog open={isDetailsOpen} onClose={() => toggleDetails()}>
        <div className="fixed inset-0 bg-black/80 z-30" aria-hidden="true" />
        <Dialog.Panel>
          <div className="fixed z-40 border-b-high border-2 bg-b-med inset-[10%] rounded-xl pt-8 px-8 shadow-lg shadow-b-low overflow-y-auto">
            <button
              className="z-50 absolute top-8 right-8 text-f-low hover:text-f-high"
              aria-label="close details"
              onClick={toggleDetails}
            >
              <X />
            </button>
            <div className="relative w-full mb-8">
              <div className="mb-8">
                <Dialog.Title className="mb-1 text-xl font-bold first-letter:capitalize">
                  {need.name}
                </Dialog.Title>
                <div className="text-f-med mb-4 text-sm flex flex-row items-center ">
                  Progress: {progress} / {need.goal}
                  <span className="pl-2 text-f-high">
                    {progress >= need.goal && <Check size={16} />}
                  </span>
                </div>
                <div className="w-full h-3 relative mb-2 rounded-md flex items-center overflow-hidden bg-gradient-to-r from-indigo-400 to-orange-200 via-pink-200 border-b-high border-2">
                  <div
                    className="absolute top-0 bottom-0 right-0 bg-b-med transition-[width]"
                    style={{
                      width: `${
                        100 -
                        (progress <= need.goal ? progress / need.goal : 1) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
              <h3 className="font-bold text-sm mb-4">Units</h3>
              {/* fix: units setting doesn't persist to other need menus -- needs state to be stored */}
              <RadioGroup
                value={options.units}
                onChange={(newValue) =>
                  setOptions({ ...options, units: newValue })
                }
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
                {need.suggestions.map((suggestion: Suggestion) => (
                  <li key={suggestion.name} className="mb-2">
                    {parseNumberToString(
                      suggestion.portion[selectedUnits].quantity,
                    )}{" "}
                    {suggestion.portion[selectedUnits].unit} {suggestion.name}{" "}
                  </li>
                ))}
                <li></li>
              </ul>
              <div className="mb-8 w-full rounded-xl -mx-2 p-2 border-2 border-b-high">
                <Disclosure>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="font-bold text-sm flex flex-row items-center gap-2 w-full justify-between p-2 hover:bg-b-high rounded-lg">
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
                            {need.types.map((type: string) => (
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
              <h3 className="font-bold text-sm mb-4">Log progess (servings)</h3>
              <div className="mb-8 flex flex-row flex-wrap gap-4 items-center justify-start">
                {Array.from(fractionsMap.entries()).map((entry) => (
                  <Button
                    key={entry[0]}
                    onClick={() => incrementProgress(entry[0])}
                  >
                    {entry[1]}
                  </Button>
                ))}
                {need.goal > 1 && progress < need.goal ? (
                  <Button onClick={() => incrementProgress(need.goal)}>
                    Remaining ({need.goal - progress})
                  </Button>
                ) : (
                  ""
                )}
              </div>

              <h3 className="font-bold text-sm mb-4">Reset progess</h3>
              <Button
                onClick={() => resetProgress()}
                classes="flex flex-row gap-2"
              >
                <RotateCcw size={14} /> <span>Reset</span>
              </Button>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}
