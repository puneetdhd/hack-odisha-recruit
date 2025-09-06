import React, { useState } from "react";
import { Pencil, Plus, Check, X } from "lucide-react";

function QuestionListContainer({ questionList, setQuestionList }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [newType, setNewType] = useState("General");

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditedQuestion(questionList[index].question);
  };

  const handleSave = (index) => {
    const updated = [...questionList];
    updated[index].question = editedQuestion;
    setQuestionList(updated);
    setEditingIndex(null);
  };

  const handleAdd = () => {
    if (!newQuestion.trim()) return;
    const updated = [
      ...questionList,
      { question: newQuestion, type: newType || "General" },
    ];
    setQuestionList(updated);
    setNewQuestion("");
    setNewType("General");
  };

  return (
    <div>
      <h2 className="font-bold text-lg mb-5">Generated Interview Questions:</h2>
      <div className="p-5 border border-gray-300 rounded-xl space-y-3 bg-white">
        {questionList.map((item, index) => (
          <div
            key={index}
            className="p-3 border border-gray-200 rounded-xl flex justify-between items-start"
          >
            <div className="flex-1">
              {editingIndex === index ? (
                <input
                  type="text"
                  value={editedQuestion}
                  onChange={(e) => setEditedQuestion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                />
              ) : (
                <h2 className="font-bold">{item.question}</h2>
              )}
              <p className="text-sm font-medium text-primary">
                Type: {item?.type}
              </p>
            </div>

            {editingIndex === index ? (
              <div className="flex gap-2 ml-3">
                <button
                  onClick={() => handleSave(index)}
                  className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => setEditingIndex(null)}
                  className="p-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleEdit(index)}
                className="ml-3 p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              >
                <Pencil size={16} />
              </button>
            )}
          </div>
        ))}

        {/* Add new question */}
        <div className="p-3 border border-dashed border-gray-300 rounded-xl">
          <h3 className="font-semibold mb-2">Add New Question</h3>
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Enter new question..."
            className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          />
          <input
            type="text"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            placeholder="Enter type (optional)..."
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          />
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90"
          >
            <Plus size={16} /> Add Question
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuestionListContainer;
