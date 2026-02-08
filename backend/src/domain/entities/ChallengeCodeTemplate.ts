export interface IChallengeCodeTemplate {
  id?: string;

  challengeId: string;
  // language: "javascript" | "python" | "java" | "c" | "cpp";
  language : string;

  starterCode: string;
  solutionCode: string;
}
