export interface IChallengeTestCase {
  id?: string;
  challengeId: string;

  input: string;
  expectedOutput: string;

  isSample: boolean; // visible to user?
}
