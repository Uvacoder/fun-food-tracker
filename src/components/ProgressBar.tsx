interface Props {
  progress: number;
  goal: Goal;
  overflow: boolean;
  children?: any;
  hoverable?: boolean;
}

export default function ProgressBar({
  progress,
  goal,
  overflow,
  hoverable,
  children,
}: Props) {
  return (
    <>
      <div
        className={`w-full h-full relative mb-2 rounded-xl flex items-center overflow-hidden border-2 transition-transform ${
          overflow ? "translate-x-2" : ""
        } ${
          hoverable
            ? "border-border hover:border-f-low opacity-95 hover:opacity-100"
            : "border-border"
        } gradient`}
      >
        <div
          className="absolute inset-y-0 right-0 bg-b-med border-border transition-[width]"
          style={{
            width: `${
              100 -
              (progress <= goal.quantity ? progress / goal.quantity : 1) * 100
            }%`,
            borderLeftWidth: `${
              progress > 0 && progress < goal.quantity ? "2px" : "0"
            }`,
          }}
        />
        {/* dashed vertical portion markers */}
        {[...Array(goal.quantity - 1)].map((_, i) => (
          <span
            className="absolute h-full border-dashed border-border border-l-2 w-0 transition-opacity duration-500"
            style={{
              left: `${((i + 1) / goal.quantity) * 100}%`,
            }}
            key={i}
          ></span>
        ))}
        {children}
      </div>
    </>
  );
}
