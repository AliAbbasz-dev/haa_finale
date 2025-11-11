export type DueState = "ok" | "due_soon" | "overdue";

export interface DueInput {
  next_due_date?: string | null; // ISO date (YYYY-MM-DD)
  next_due_mileage?: number | null;
  current_mileage?: number | null; // relevant for vehicles
  today?: Date; // optional override for testing
  daysSoonThreshold?: number; // default 30
  milesSoonThreshold?: number; // default 500
}

export interface DueResult {
  state: DueState;
  dueInDays?: number | null;
  overdueDays?: number | null;
  dueInMiles?: number | null;
  overdueMiles?: number | null;
}

function diffInDays(from: Date, to: Date) {
  const ms = to.setHours(0, 0, 0, 0) - from.setHours(0, 0, 0, 0);
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function getDueStatus(input: DueInput): DueResult {
  const {
    next_due_date,
    next_due_mileage,
    current_mileage,
    today = new Date(),
    daysSoonThreshold = 30,
    milesSoonThreshold = 500,
  } = input;

  let dueInDays: number | null | undefined = undefined;
  let overdueDays: number | null | undefined = undefined;
  let dueInMiles: number | null | undefined = undefined;
  let overdueMiles: number | null | undefined = undefined;
  let isOverdue = false;
  let isDueSoon = false;

  // Date-based due
  if (next_due_date) {
    const dueDate = new Date(next_due_date);
    const d = diffInDays(today, dueDate);
    if (d < 0) {
      isOverdue = true;
      overdueDays = Math.abs(d);
    } else if (d <= daysSoonThreshold) {
      isDueSoon = true;
      dueInDays = d;
    }
  }

  // Mileage-based due
  if (typeof next_due_mileage === "number" && typeof current_mileage === "number") {
    const m = next_due_mileage - current_mileage;
    if (m < 0) {
      isOverdue = true;
      overdueMiles = Math.abs(m);
    } else if (m <= milesSoonThreshold) {
      isDueSoon = true;
      dueInMiles = m;
    }
  }

  const state: DueState = isOverdue ? "overdue" : isDueSoon ? "due_soon" : "ok";
  return { state, dueInDays, overdueDays, dueInMiles, overdueMiles };
}
