// import Editor from "@monaco-editor/react";
// import { useState } from "react";
// import { runCodeApi, submitSolutionApi } from "../../../api/submissionApi";
// import { useParams } from "react-router-dom";

// const EditorPanel = () => {
//   const { id } = useParams<{ id: string }>();

//   const [code, setCode] = useState("// Write your solution here");
//   const [language, setLanguage] = useState("javascript");
//   const [loading, setLoading] = useState(false);

//   const handleRun = async () => {
//     try {
//       setLoading(true);

//       const result = await runCodeApi({
//         language,
//         code,
//         input: "", // later connect with custom input panel
//       });

//       console.log("Run result:", result);
//       alert(result.stdout || result.stderr);
//     } catch (err: any) {
//       alert(err.response?.data?.message || "Run failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       if (!id) return;

//       setLoading(true);

//       const result = await submitSolutionApi({
//         challengeId: id,
//         language,
//         code,
//       });

//       alert(
//         `Status: ${result.status}\nXP Earned: ${result.xpEarned}`
//       );
//     } catch (err: any) {
//       alert(err.response?.data?.message || "Submit failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex-1">
//       <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800">
//         <select
//           value={language}
//           onChange={(e) => setLanguage(e.target.value)}
//           className="bg-slate-900 text-sm px-2 py-1 rounded"
//         >
//           <option value="javascript">JavaScript</option>
//           <option value="python">Python</option>
//         </select>

//         <div className="flex gap-2">
//           <button
//             onClick={handleRun}
//             disabled={loading}
//             className="px-3 py-1 bg-slate-700 rounded text-sm"
//           >
//             Run
//           </button>

//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="px-3 py-1 bg-green-600 rounded text-sm"
//           >
//             Submit
//           </button>
//         </div>
//       </div>

//       <Editor
//         height="100%"
//         theme="vs-dark"
//         language={language}
//         value={code}
//         onChange={(v) => setCode(v || "")}
//       />
//     </div>
//   );
// };

// export default EditorPanel;







import Editor from "@monaco-editor/react";
import { useState, useEffect } from "react";
import { runCodeApi, submitSolutionApi } from "../../../api/submissionApi";


const EditorPanel = ({ templates, challengeId, testCases, setResult, onSuccess }: any) => {
  const [selectedLang, setSelectedLang] = useState(templates[0]?.language || "javascript");
  const [code, setCode] = useState(templates[0]?.starterCode || "");
  const [loading, setLoading] = useState(false);

  // Update local state when templates prop changes (e.g. data fetched)
  useEffect(() => {
    if (templates.length > 0) {
      const initialLang = templates[0].language;
      setSelectedLang(initialLang);
      setCode(templates[0].starterCode);
    }
  }, [templates]);


  //
  const handleRun = async () => {
    setLoading(true);

    const sampleInput = testCases?.find((tc: any) => tc.isSample)?.input || "";

    const res = await runCodeApi({
      language: selectedLang,
      code,
      input: sampleInput
    });

    // console.log(res);
    setResult({
      status: res.stderr ? "ERROR" : "RUN",
      stdout: res.stdout,
      stderr: res.stderr,
      runtime: res.runtime,
      memory: res.memory
    });
    setLoading(false);
  };


  //
  const handleSubmit = async () => {
    setLoading(true);

    try {
      const res = await submitSolutionApi({
        challengeId,
        language: selectedLang,
        code
      });

      setResult(res);

      if (res.status === 'PASSED') {
        setTimeout(() => {
          if (onSuccess) onSuccess(res.xpEarned || 0);
        }, 1000);
      }
    } catch (err: any) {
      console.error(err);
      // alert("Submit failed");
      setResult({
        status: "ERROR",
        stderr: err.response?.data?.message || "Submission failed"
      });
    } finally {
      setLoading(false);
    }
  };




  return (

    // <div className="flex-1">
    <div className="flex-1 flex flex-col">

      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-[#0f172a]">
        <select
          value={selectedLang}
          onChange={(e) => {
            const newLang = e.target.value;
            setSelectedLang(newLang);

            // Find template for new language
            const template = templates.find((t: any) => t.language === newLang);
            if (template) {
              setCode(template.starterCode);
            }
          }}
          className="bg-slate-900 px-2 py-1 rounded"
        >
          {templates.map((t: any) => (
            <option key={t.language} value={t.language}>
              {t.language}
            </option>
          ))}
        </select>


        <div className="flex gap-2">
          <button
            onClick={handleRun}
            disabled={loading}
            className={`px-3 py-1 rounded transition ${loading ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-slate-700 hover:bg-slate-600'}`}
          >
            {loading ? 'Running...' : 'Run'}
          </button>


          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-1 rounded transition ${loading ? 'bg-green-900/50 text-green-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500'}`}

          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>



      {/* Editor Wrapper */}
      <div className="flex-1">
        <Editor
          height="100%"
          theme="vs-dark"
          language={selectedLang}
          value={code}
          onChange={(v) => setCode(v || "")}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false
          }}
        />
      </div>

      {/* <Editor
        height="100%"
        theme="vs-dark"
        language={selectedLang}
        value={code}
        onChange={(v) => setCode(v || "")}
      /> */}
    </div>
  );
};

export default EditorPanel;






// import Editor from "@monaco-editor/react";
// import { useState } from "react";

// const EditorPanel = () => {
//   const [code, setCode] = useState("// Write your solution here");

//   return (
//     <div className="flex-1">
//       <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800">
//         <select className="bg-slate-900 text-sm px-2 py-1 rounded">
//           <option>JavaScript</option>
//           <option>Python</option>
//         </select>

//         <div className="flex gap-2">
//           <button className="px-3 py-1 bg-slate-700 rounded text-sm">
//             Run
//           </button>
//           <button className="px-3 py-1 bg-green-600 rounded text-sm">
//             Submit
//           </button>
//         </div>
//       </div>

//       <Editor
//         height="100%"
//         theme="vs-dark"
//         language="javascript"
//         value={code}
//         onChange={(v) => setCode(v || "")}
//       />
//     </div>
//   );
// };

// export default EditorPanel;
