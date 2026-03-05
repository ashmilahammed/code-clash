const TestCasePanel = ({ result }: any) => {
  if (!result) {
    return (
      <div className="h-40 border-t border-slate-800 p-4 text-slate-400">
        Run your code to see results
      </div>
    );
  }


  return (
    <div className="h-40 border-t border-slate-800 p-4 bg-[#0f172a]">

      {/* status */}
      <div className="text-lg font-semibold">
        {result.status === "PASSED" && (
          <span className="text-green-400">PASSED 🎉</span>
        )}
        {result.status === "FAILED" && (
          <span className="text-red-400">FAILED ❌</span>
        )}
        {result.status === "ERROR" && (
          <span className="text-red-400">RUNTIME ERROR ⚠️</span>
        )}
        {result.status === "RUN" && (
          <span className="text-blue-400">Executed</span>
        )}
      </div>


      {/* xp */}
      {result.xpEarned > 0 && (
        <div className="text-yellow-400 mt-2">
          +{result.xpEarned} XP Earned
        </div>
      )}


      {/* Metrics */}
      <div className="text-xs text-slate-400">
        Runtime: {result.runtime}s | Memory: {result.memory}KB
      </div>

      {/* Stdout */}
      {result.stdout && (
        <pre className="mt-2 text-xs bg-slate-900 p-2 rounded">
          {result.stdout}
        </pre>
      )}

      {/* Stderr */}
      {result.stderr && (
        <pre className="mt-2 text-xs text-red-400">
          {result.stderr}
        </pre>
      )}
    </div>
  );
};

export default TestCasePanel;
