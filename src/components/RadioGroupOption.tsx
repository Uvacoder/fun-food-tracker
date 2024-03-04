import { RadioGroup } from "@headlessui/react";

interface Props {
  children?: any;
  value?: any;
}
export default function RadioGroupOption({ children, value }: Props) {
  return (
    <RadioGroup.Option
      className={({ checked }) =>
        `${
          checked ? "border-border text-f-med" : "border-border-low text-f-low"
        } [&_*]:cursor-pointer cursor-pointer first:rounded-l-lg last:rounded-r-lg text-xs font-semibold tracking-tighter hover:text-f-med h-8 px-2 shadow-sm border-2 hover:border-border flex items-center justify-center`
      }
      value={value}
    >
      <div>{children}</div>
    </RadioGroup.Option>
  );
}
