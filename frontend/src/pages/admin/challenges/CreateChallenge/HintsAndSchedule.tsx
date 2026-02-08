import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  addChallengeHintsApi,
  updateChallengeScheduleApi,
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
    navigate(`/admin/challenges/create/${id}/templates`);
  };





  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold text-white">
        Create Challenge – Hints & Schedule
      </h1>

      {/* Hints */}
      {/* {hints.map((h, i) => (
        <textarea
          key={i}
          value={h.content}
          onChange={(e) => updateHint(i, e.target.value)}
          className="w-full p-3 rounded bg-[#020617]"
          placeholder={`Hint ${i + 1}`}
        />
      ))} */}
      {hints.map((h, i) => (
        <div key={i} className="space-y-2">
          <textarea
            value={h.content}
            onChange={(e) => updateHint(i, e.target.value)}
            className="w-full p-3 rounded bg-[#020617]"
            placeholder={`Hint ${i + 1}`}
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
