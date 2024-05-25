import CodeSnippet from "./code_snippet";
import { useState } from "react";
import { Switch } from "@headlessui/react";
import SnippetForm from "./snippet_card_form";

export default function ViewSnippet({
  card,
  snippetTags,
  closeModal,
  updateCard,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [publicSetting, setPublicSetting] = useState(card.privacy === 0);

  const handleEdit = () => {
    setIsEditing(true);
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <>
      {!isEditing ? (
        <div
          id="view-snippet-modal"
          className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-60"
        >
          <div className="bg-white h-3/4 w-2/4 rounded-2xl p-5 max-h-[calc(100vh - 100px)] overflow-y-auto flex flex-col items-center">
            <span className="px-2 py-1 mb-3 text-xs rounded-full bg-violet-200 text-violet-800">
              {publicSetting ? "Public" : "Private"}
            </span>
            <h1 className="mb-4 text-2xl font-semibold text-center text-gray-900">
              {card.title}
            </h1>
            <h1 className="mb-2 text-lg font-semibold text-gray-900">
              Description
            </h1>
            <p className="mb-3 text-center">{card.snippet_description}</p>
            <h1 className="mb-2 text-lg font-semibold text-gray-900">Tags</h1>
            <div className="flex flex-wrap justify-center mb-3">
              {snippetTags.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 mb-3 mr-2 text-xs rounded-full bg-violet-200 text-violet-800"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-lg font-semibold text-gray-900">Snippet</h1>
            <div className="mt-2 w-full bg-[#3a404d] rounded-md overflow-hidden">
              <div className="flex items-center justify-between p-3 text-xs text-white">
                <h1>{card.code_language}</h1>
                <button
                  className="inline-flex items-center gap-1 py-1"
                  onClick={() => {
                    setTimeout(() => {
                      navigator.clipboard.writeText(card.code_content);
                    }, 0);
                  }}
                >
                  <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-5-4v4h4V3h-4Z"
                    />
                  </svg>
                  Copy code
                </button>
              </div>
              <CodeSnippet
                code={card.code_content}
                language={card.code_language}
              />
            </div>
            <div className="flex justify-center w-full mt-6">
              <button
                onClick={() => closeModal()}
                className="px-4 py-2 text-white bg-gray-900 rounded-full"
              >
                Close
              </button>
              {updateCard && (
                <button
                  onClick={() => handleEdit()}
                  className="px-4 py-2 text-white bg-gray-900 rounded-full"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <SnippetForm
          card={card}
          snippetTags={snippetTags}
          closeModal={closeModal}
          updateCard={updateCard}
          isAdding={false}
        />
      )}
    </>
  );
}
