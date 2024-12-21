// ActionButton.tsx
"use client";

import { FC } from "react";

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  color: string;
}

const ActionButton: FC<ActionButtonProps> = ({ label, onClick, color }) => (
  <button
    onClick={onClick}
    className={`${color} text-white px-4 py-2 rounded-md hover:opacity-90`}
  >
    {label}
  </button>
);

export default ActionButton;
