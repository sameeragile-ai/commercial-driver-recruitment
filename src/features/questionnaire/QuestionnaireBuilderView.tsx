import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { QuestionnaireQuestion, QuestionRule } from '../../types';
import {
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Layers,
  Sparkles,
  GripVertical,
  Save,
  Play,
  RotateCcw,
} from 'lucide-react';

export const QuestionnaireBuilderView: React.FC = () => {
  const { questions, updateQuestions, addToast } = useStore();

  const [selectedPosition, setSelectedPosition] = useState<'CDL-A' | 'CDL-B' | 'CDL-C' | 'Non-CDL'>('CDL-A');
  const [editingQuestions, setEditingQuestions] = useState<QuestionnaireQuestion[]>(questions);

  // Live test preview answers
  const [testAnswers, setTestAnswers] = useState<Record<string, any>>({
    q_cdl_class: 'Class A CDL',
    q_exp_years: 3,
    q_moving_violations: 0,
    q_dot_accidents: false,
    q_clearinghouse: true,
    q_endorsements: ['Tanker (N)'],
  });

  const positionQuestions = editingQuestions.filter((q) =>
    q.positionApplicability.includes(selectedPosition)
  );

  // Evaluate candidate live result based on knockout rules
  const testResult = (() => {
    let result: 'Qualified' | 'Review Required' | 'Not Qualified' = 'Qualified';
    const reasons: string[] = [];

    positionQuestions.forEach((q) => {
      const val = testAnswers[q.id];
      q.rules.forEach((rule) => {
        if (rule.operator === 'equals' && val === rule.value) {
          if (rule.action === 'knockout') {
            result = 'Not Qualified';
            if (rule.knockoutReason) reasons.push(rule.knockoutReason);
          } else if (rule.action === 'flag_review' && result !== 'Not Qualified') {
            result = 'Review Required';
            if (rule.knockoutReason) reasons.push(rule.knockoutReason);
          }
        } else if (rule.operator === 'less_than' && typeof val === 'number' && val < Number(rule.value)) {
          if (rule.action === 'knockout') {
            result = 'Not Qualified';
            if (rule.knockoutReason) reasons.push(rule.knockoutReason);
          } else if (rule.action === 'flag_review' && result !== 'Not Qualified') {
            result = 'Review Required';
            if (rule.knockoutReason) reasons.push(rule.knockoutReason);
          }
        } else if (rule.operator === 'greater_than' && typeof val === 'number' && val > Number(rule.value)) {
          if (rule.action === 'knockout') {
            result = 'Not Qualified';
            if (rule.knockoutReason) reasons.push(rule.knockoutReason);
          } else if (rule.action === 'flag_review' && result !== 'Not Qualified') {
            result = 'Review Required';
            if (rule.knockoutReason) reasons.push(rule.knockoutReason);
          }
        } else if (rule.operator === 'in' && rule.value === val) {
          if (rule.action === 'knockout') {
            result = 'Not Qualified';
            if (rule.knockoutReason) reasons.push(rule.knockoutReason);
          }
        }
      });
    });

    return { result, reasons };
  })();

  const handleAddQuestion = () => {
    const newQ: QuestionnaireQuestion = {
      id: `q_custom_${Date.now()}`,
      label: 'New Screening Question',
      description: 'Explain requirements under carrier safety guidelines',
      type: 'yes_no',
      required: true,
      rules: [
        {
          field: `q_custom_${Date.now()}`,
          operator: 'equals',
          value: false,
          action: 'knockout',
          knockoutReason: 'Does not satisfy company safety standard',
        },
      ],
      positionApplicability: [selectedPosition],
    };
    setEditingQuestions([...editingQuestions, newQ]);
  };

  const handleRemoveQuestion = (id: string) => {
    setEditingQuestions(editingQuestions.filter((q) => q.id !== id));
  };

  const handleSave = () => {
    updateQuestions(editingQuestions);
    addToast('Questionnaire Saved', 'Rule engine and qualification criteria deployed live', 'success');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold font-heading text-[#14161A]">
            Pre-Qualification Questionnaire Builder & Knockout Engine
          </h1>
          <p className="text-xs text-[#5B616B] mt-0.5">
            Configure automated instant-screening rules, knockout conditions, and position-specific safety criteria
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleAddQuestion}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#14161A] bg-white hover:bg-[#FAF9F6] border border-[#ECEAE4] rounded-xl shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-[#0E7C7B]" />
            <span>Add Question</span>
          </button>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white rounded-xl shadow-xs transition-all active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #0E7C7B 0%, #2563EB 100%)',
            }}
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save & Deploy Rules</span>
          </button>
        </div>
      </div>

      {/* Position Tab Selector */}
      <div className="flex items-center gap-2 p-1 bg-white border border-[#ECEAE4] rounded-xl w-fit">
        {(['CDL-A', 'CDL-B', 'CDL-C', 'Non-CDL'] as const).map((pos) => (
          <button
            key={pos}
            onClick={() => setSelectedPosition(pos)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              selectedPosition === pos
                ? 'bg-[#0E7C7B] text-white shadow-2xs'
                : 'text-[#5B616B] hover:text-[#14161A]'
            }`}
          >
            {pos} Standards
          </button>
        ))}
      </div>

      {/* Two Column Layout: Question Builder Left, Live Preview Simulator Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Questions List & Knockout Rules */}
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-semibold text-[#9AA0A8] uppercase tracking-wider">
            Screening Questions ({positionQuestions.length})
          </div>

          <div className="space-y-4">
            {positionQuestions.map((question, idx) => (
              <div
                key={question.id}
                className="bg-white rounded-2xl border border-[#ECEAE4] p-5 shadow-sm space-y-3 relative group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="w-6 h-6 rounded-md bg-[#FAF9F6] border border-[#ECEAE4] text-[11px] font-mono font-semibold flex items-center justify-center text-[#5B616B]">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={question.label}
                      onChange={(e) => {
                        const updated = editingQuestions.map((q) =>
                          q.id === question.id ? { ...q, label: e.target.value } : q
                        );
                        setEditingQuestions(updated);
                      }}
                      className="text-xs font-semibold text-[#14161A] w-full px-2 py-1 rounded border border-transparent hover:border-[#ECEAE4] focus:border-[#0E7C7B] outline-none"
                    />
                  </div>

                  <button
                    onClick={() => handleRemoveQuestion(question.id)}
                    className="p-1 text-[#9AA0A8] hover:text-rose-600 rounded transition-colors"
                    title="Delete Question"
                  >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <label className="block text-[10px] text-[#9AA0A8] uppercase mb-1">Answer Input Type</label>
                    <select
                      value={question.type}
                      onChange={(e) => {
                        const updated = editingQuestions.map((q) =>
                          q.id === question.id ? { ...q, type: e.target.value as any } : q
                        );
                        setEditingQuestions(updated);
                      }}
                      className="w-full text-xs px-2.5 py-1.5 border border-[#ECEAE4] rounded-lg bg-white outline-none"
                    >
                      <option value="yes_no">Yes / No Boolean</option>
                      <option value="number">Numeric (e.g. Years, Violations)</option>
                      <option value="select">Single Choice Dropdown</option>
                      <option value="multi_select">Multi-Select Endorsements</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#9AA0A8] uppercase mb-1">DOT Mandate</label>
                    <div className="flex items-center gap-2 pt-1.5">
                      <input
                        type="checkbox"
                        checked={question.required}
                        onChange={(e) => {
                          const updated = editingQuestions.map((q) =>
                            q.id === question.id ? { ...q, required: e.target.checked } : q
                          );
                          setEditingQuestions(updated);
                        }}
                        className="rounded accent-[#0E7C7B]"
                      />
                      <span className="text-xs text-[#5B616B]">Mandatory Question</span>
                    </div>
                  </div>
                </div>

                {/* Rules Attached */}
                {question.rules.length > 0 && (
                  <div className="pt-2 border-t border-[#ECEAE4] space-y-2">
                    <span className="text-[10px] font-semibold text-rose-700 uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                      Knockout / Review Rules ({question.rules.length})
                    </span>

                    {question.rules.map((rule, rIdx) => (
                      <div
                        key={rIdx}
                        className="p-2.5 bg-rose-50/50 border border-rose-200/80 rounded-xl text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-rose-900 font-semibold">
                          <span>
                            If answer {rule.operator.replace('_', ' ')} {String(rule.value)} → {rule.action.toUpperCase()}
                          </span>
                        </div>
                        {rule.knockoutReason && (
                          <div className="text-[11px] text-rose-800">
                            Reason: {rule.knockoutReason}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Interactive Applicant Simulator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-semibold text-[#9AA0A8] uppercase tracking-wider">
            Live Simulator & Knockout Feedback
          </div>

          <div className="bg-white rounded-2xl border border-[#ECEAE4] p-5 shadow-sm space-y-5 sticky top-20">
            {/* Real-time Result Badge */}
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
                testResult.result === 'Qualified'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : testResult.result === 'Review Required'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {testResult.result === 'Qualified' ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="min-w-0">
                <div className="text-sm font-bold font-heading">
                  Result: {testResult.result}
                </div>
                <p className="text-xs mt-0.5 leading-snug">
                  {testResult.result === 'Qualified'
                    ? 'Candidate satisfies all mandatory carrier hiring standards and FMCSA guidelines.'
                    : testResult.reasons.join(' · ')}
                </p>
              </div>
            </div>

            {/* Interactive Questions form */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#14161A] font-semibold mb-1">
                  1. Valid CDL Status
                </label>
                <select
                  value={testAnswers.q_cdl_class || 'Class A CDL'}
                  onChange={(e) => setTestAnswers({ ...testAnswers, q_cdl_class: e.target.value })}
                  className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg bg-white"
                >
                  <option value="Class A CDL">Class A CDL (Valid)</option>
                  <option value="Class B CDL">Class B CDL</option>
                  <option value="No CDL">No CDL (Instant Knockout)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#14161A] font-semibold mb-1">
                  2. Verifiable Tractor-Trailer Experience (Years)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={testAnswers.q_exp_years}
                    onChange={(e) => setTestAnswers({ ...testAnswers, q_exp_years: Number(e.target.value) })}
                    className="w-full accent-[#0E7C7B]"
                  />
                  <span className="font-mono font-bold text-xs w-12 text-right">
                    {testAnswers.q_exp_years} yrs
                  </span>
                </div>
                <span className="text-[10px] text-[#9AA0A8]">
                  Rule: &lt;1 yr is knockout; &lt;2 yrs requires manager review.
                </span>
              </div>

              <div>
                <label className="block text-[#14161A] font-semibold mb-1">
                  3. Moving Violations (36 Mo)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={testAnswers.q_moving_violations}
                  onChange={(e) => setTestAnswers({ ...testAnswers, q_moving_violations: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg"
                />
                <span className="text-[10px] text-[#9AA0A8]">
                  Rule: &gt;2 moving violations triggers knockout.
                </span>
              </div>

              <div>
                <label className="block text-[#14161A] font-semibold mb-1">
                  4. DOT Recordable Accidents in 3 Years?
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTestAnswers({ ...testAnswers, q_dot_accidents: false })}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold ${
                      !testAnswers.q_dot_accidents ? 'bg-[#0E7C7B] text-white border-[#0E7C7B]' : 'bg-white border-[#ECEAE4]'
                    }`}
                  >
                    No (Clean)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestAnswers({ ...testAnswers, q_dot_accidents: true })}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold ${
                      testAnswers.q_dot_accidents ? 'bg-amber-600 text-white border-amber-600' : 'bg-white border-[#ECEAE4]'
                    }`}
                  >
                    Yes (Flag Review)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#14161A] font-semibold mb-1">
                  5. FMCSA Clearinghouse Status
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTestAnswers({ ...testAnswers, q_clearinghouse: true })}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold ${
                      testAnswers.q_clearinghouse ? 'bg-[#0E7C7B] text-white border-[#0E7C7B]' : 'bg-white border-[#ECEAE4]'
                    }`}
                  >
                    Clean Query
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestAnswers({ ...testAnswers, q_clearinghouse: false })}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold ${
                      !testAnswers.q_clearinghouse ? 'bg-rose-600 text-white border-rose-600' : 'bg-white border-[#ECEAE4]'
                    }`}
                  >
                    Prohibited (Knockout)
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                setTestAnswers({
                  q_cdl_class: 'Class A CDL',
                  q_exp_years: 3,
                  q_moving_violations: 0,
                  q_dot_accidents: false,
                  q_clearinghouse: true,
                  q_endorsements: ['Tanker (N)'],
                })
              }
              className="w-full py-1.5 text-xs font-medium text-[#5B616B] hover:text-[#14161A] bg-[#FAF9F6] border border-[#ECEAE4] rounded-xl flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Simulator Inputs</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
