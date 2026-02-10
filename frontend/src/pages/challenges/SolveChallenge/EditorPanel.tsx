import Editor from "@monaco-editor/react";
import { useState } from "react";

const EditorPanel = () => {
  const [code, setCode] = useState("// Write your solution here");

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800">
        <select className="bg-slate-900 text-sm px-2 py-1 rounded">
          <option>JavaScript</option>
          <option>Python</option>
        </select>

        <div className="flex gap-2">
          <button className="px-3 py-1 bg-slate-700 rounded text-sm">
            Run
          </button>
          <button className="px-3 py-1 bg-green-600 rounded text-sm">
            Submit
          </button>
        </div>
      </div>

      <Editor
        height="100%"
        theme="vs-dark"
        language="javascript"
        value={code}
        onChange={(v) => setCode(v || "")}
      />
    </div>
  );
};

export default EditorPanel;
