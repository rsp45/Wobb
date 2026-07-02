import { Icon } from "./Icon";

interface VerifiedBadgeProps {
  verified: boolean;
}

export function VerifiedBadge({ verified }: VerifiedBadgeProps) {
  if (!verified) return null;

  return (
    <span
      aria-label="Verified"
      title="Verified"
      className="inline-grid h-5 w-5 place-items-center rounded-full bg-blue-50 text-blue-600"
    >
      <Icon name="check" className="h-3.5 w-3.5" />
    </span>
  );
}
