import {
  Outlet,
  // useParams
} from "react-router-dom";



import { Link, useLocation, useParams } from "react-router-dom";

const CreateChallengeWizard = () => {
  const { id } = useParams();
  const location = useLocation();

  // Helper to determine if a step is active or completed
  // This is simple styling logic for now
  const isActive = (path: string): boolean => {
    if (!path) {
      return location.pathname.endsWith("/create") || !!location.pathname.match(/\/edit\/[^/]+$/);
    }
    return location.pathname.includes(path);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Wizard header */}
      <div className="bg-slate-900 rounded-xl p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              {id ? "Edit Challenge" : "Create New Challenge"}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {id ? "Update challenge details" : "Complete all steps before activating the challenge"}
            </p>
          </div>
          {id && (
            <div className="px-3 py-1 bg-amber-900/30 text-amber-500 rounded border border-amber-500/30 text-xs">
              Editing Mode
            </div>
          )}
        </div>

        {/* Step indicator */}
        <div className="flex gap-3 mt-6 text-sm overflow-x-auto pb-2">
          <Step label="Basic Info" path="" id={id} active={isActive("")} />
          <Step label="Tags" path="tags" id={id} active={isActive("tags")} />
          <Step label="Languages" path="languages" id={id} active={isActive("languages")} />
          <Step label="Test Cases" path="test-cases" id={id} active={isActive("test-cases")} />
          <Step label="Hints & Schedule" path="hints" id={id} active={isActive("hints")} />
          <Step label="Code Templates" path="templates" id={id} active={isActive("templates")} />
        </div>
      </div>

      {/* Step content */}
      <Outlet />
    </div>
  );
};

const Step = ({ label, path, id, active }: { label: string; path: string; id?: string; active?: boolean }) => {
  // If we have an ID, we can navigate directly
  // If not, we disable navigation (user must follow flow)
  const canNavigate = !!id;
  const basePath = id ? `/admin/challenges/edit/${id}` : "/admin/challenges/create";
  const to = path ? `${basePath}/${path}` : basePath;

  const baseClass = "px-4 py-2 rounded whitespace-nowrap transition-colors";
  const activeClass = "bg-cyan-600 text-white font-medium";
  const inactiveClass = canNavigate
    ? "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 cursor-pointer"
    : "bg-slate-800/50 text-slate-600 cursor-not-allowed";

  if (canNavigate) {
    return (
      <Link to={to} className={`${baseClass} ${active ? activeClass : inactiveClass}`}>
        {label}
      </Link>
    );
  }

  return (
    <div className={`${baseClass} ${active ? activeClass : inactiveClass}`}>
      {label}
    </div>
  );
};

export default CreateChallengeWizard;
