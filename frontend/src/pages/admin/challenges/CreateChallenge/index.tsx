import {
  Outlet,
  // useParams
} from "react-router-dom";



const CreateChallengeWizard = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Wizard header */}
      <div className="bg-slate-900 rounded-xl p-6">
        <h1 className="text-2xl font-semibold text-white">
          Create New Challenge
        </h1>

        <p className="text-slate-400 text-sm mt-1">
          Complete all steps before activating the challenge
        </p>

        {/* Step indicator */}
        <div className="flex gap-3 mt-4 text-sm">
          <Step label="Basic Info" />
          <Step label="Tags" />
          <Step label="Languages" />
          <Step label="Test Cases" />
          <Step label="Hints" />
          <Step label="Code" />
        </div>
      </div>

      {/* Step content */}
      <Outlet />
    </div>
  );
};

const Step = ({ label }: { label: string }) => (
  <div className="px-3 py-1 rounded bg-slate-800 text-slate-300">
    {label}
  </div>
);

export default CreateChallengeWizard;
