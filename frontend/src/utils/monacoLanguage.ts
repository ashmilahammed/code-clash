export const mapLanguageToMonaco = (lang: string) => {
  switch (lang.toLowerCase()) {
    case "javascript":
    case "js":
      return "javascript";
    case "typescript":
    case "ts":
      return "typescript";
    case "python":
      return "python";
    case "java":
      return "java";
    case "cpp":
    case "c++":
      return "cpp";
    case "c":
      return "c";
    default:
      return "plaintext";
  }
};
