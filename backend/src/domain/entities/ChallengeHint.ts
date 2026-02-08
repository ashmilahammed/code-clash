export interface IChallengeHint {
  id?: string;
  challengeId: string;

  order: number;
  content: string;

  unlockAfterMinutes?: number; // optional
}
