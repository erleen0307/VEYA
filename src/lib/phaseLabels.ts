export const phaseDisplay = {
  menstruation: "MENS",
  follicular: "FOLL",
  ovulatory: "OVUL",
  luteal: "LUTE",
} as const;

export const phaseColors = {
  menstruation: {
    dot: "bg-pink-500",
    border: "border-pink-400",
    background: "bg-pink-400",
    text: "text-white",
    ring: "ring-pink-400",
  },
  follicular: {
    dot: "bg-violet-400",
    border: "border-violet-300",
    background: "bg-violet-50",
    text: "text-violet-700",
    ring: "ring-violet-400",
  },
  ovulatory: {
    dot: "bg-amber-400",
    border: "border-amber-300",
    background: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-400",
  },
  luteal: {
    dot: "bg-indigo-500",
    border: "border-indigo-300",
    background: "bg-indigo-100",
    text: "text-indigo-800",
    ring: "ring-indigo-400",
  },
} as const;