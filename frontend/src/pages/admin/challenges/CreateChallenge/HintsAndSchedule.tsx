import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  addChallengeHintsApi,
  updateChallengeScheduleApi,
  getChallengeHintsApi,
  getChallengeByIdApi
} from "../../../../api/challengeApi";


type HintForm = {
  order: number;
  content: string;
  unlockAfterMinutes?: number;
};

type ScheduleForm = {
  availableFrom: string;
  availableUntil: string;
};



const ChallengeHintsAndSchedule = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [hints, setHints] = useState<HintForm[]>([
    { order: 1, content: "" },
  ]);

  const [schedule, setSchedule] = useState<ScheduleForm>({
    availableFrom: "",
    availableUntil: "",
  });

  useEffect(() => {
    if (id) {
      // Fetch hints
      getChallengeHintsApi(id)
        .then(data => {
          if (data && data.length > 0) {
            setHints(data.map(h => ({
              order: h.order,
              content: h.content,
              unlockAfterMinutes: h.unlockAfterMinutes
            })));
          }
        })
        .catch(err => console.error("Failed to fetch hints", err));

      // Fetch schedule (from challenge details)
      getChallengeByIdApi(id)
        .then(data => {
          // Ensure dates are in YYYY-MM-DDThh:mm format for datetime-local input
          const formatForInput = (dateStr?: string | Date) => {
            if (!dateStr) return "";
            const d = new Date(dateStr);
            // Adjust for timezone offset to show local time or just ISO sliced?
            // datetime-local expects "YYYY-MM-DDThh:mm"
            // toISOString() is UTC.
            // We need local time usually.
            // Simple hack:
            return new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
          };

          setSchedule({
            availableFrom: data.availableFrom ? formatForInput(data.availableFrom) : "",
            availableUntil: data.availableUntil ? formatForInput(data.availableUntil) : ""
          });
        })
        .catch(err => console.error("Failed to fetch schedule", err));
    }
  }, [id]);

  const addHint = () => {
    setHints((prev) => [
      ...prev,
      { order: prev.length + 1, content: "" },
    ]);
  };

  const updateHint = (index: number, value: string) => {
    setHints((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], content: value };
      return copy;
    });
  };

  const saveAndNext = async () => {
    if (!id) return;

    if (hints.some(h => !h.content.trim())) {
      alert("Hint content cannot be empty");
      return;
    }

    if (
      schedule.availableFrom &&
      schedule.availableUntil &&
      new Date(schedule.availableUntil) <
      new Date(schedule.availableFrom)
    ) {
      alert("Available until must be after available from");
      return;
    }

    ///
    await addChallengeHintsApi(id, hints);

    await updateChallengeScheduleApi(id, {
      availableFrom: schedule.availableFrom || null,
      availableUntil: schedule.availableUntil || null,
    });

    //
    const isEditMode = window.location.pathname.includes("/edit/");
    const basePath = isEditMode ? "/admin/challenges/edit" : "/admin/challenges/create";
    navigate(`${basePath}/${id}/templates`);
  };





  const removeHint = (index: number) => {
    setHints((prev) => prev.filter((_, i) => i !== index));
  };


  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold text-white">
        Create Challenge – Hints & Schedule
      </h1>

      {/* Hints */}
      {hints.map((h, i) => (
        <div key={i} className="space-y-2 bg-slate-900 p-4 rounded relative">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-slate-400 text-sm font-medium">Hint {i + 1}</h3>
            {hints.length > 1 && (
              <button
                onClick={() => removeHint(i)}
                className="text-slate-500 hover:text-red-500 transition-colors"
                title="Remove Hint"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>

          <textarea
            value={h.content}
            onChange={(e) => updateHint(i, e.target.value)}
            className="w-full p-3 rounded bg-[#020617]"
            placeholder={`Hint Content`}
          />

          <input
            type="number"
            min={0}
            placeholder="Unlock after (minutes)"
            value={h.unlockAfterMinutes ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              setHints(prev => {
                const copy = [...prev];
                copy[i] = {
                  ...copy[i],
                  unlockAfterMinutes: val ? Number(val) : undefined,
                };
                return copy;
              });
            }}
            className="w-full p-2 rounded bg-[#020617]"
          />
        </div>
      ))}


      <button onClick={addHint} className="btn-secondary">
        + Add Hint
      </button>

      {/* Schedule */}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="datetime-local"
          value={schedule.availableFrom}
          onChange={(e) =>
            setSchedule((prev) => ({
              ...prev,
              availableFrom: e.target.value,
            }))
          }
        />

        <input
          type="datetime-local"
          value={schedule.availableUntil}
          onChange={(e) =>
            setSchedule((prev) => ({
              ...prev,
              availableUntil: e.target.value,
            }))
          }
        />
      </div>

      <button onClick={saveAndNext} className="btn-primary">
        Save & Continue
      </button>
    </div>
  );
};

export default ChallengeHintsAndSchedule;
