import React, { useEffect, useState } from "react";
import ViewSnippet from "./snippet_modal";

export default function SnippetCard({ snippet }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snippetTags, setSnippetTags] = useState(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/snippet/tags/${snippet.id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setSnippetTags(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchTags();
  }, [snippet]);

  return (
    <>
      <div
        className="p-4 mb-4 bg-white shadow-lg cursor-pointer rounded-xl"
        onClick={() => setIsModalOpen(true)}
      >
        <p className="mb-2 text-sm text-gray-500">{snippet.username}</p>
        <h4 className="mb-2 text-xl font-semibold truncate">{snippet.title}</h4>
        <p
          className="mb-2 text-sm text-gray-600"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {snippet.snippet_description}
        </p>
        <div className="flex flex-wrap">
          {snippetTags &&
            snippetTags.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 mb-2 mr-2 text-xs rounded-full bg-violet-200 text-violet-800"
              >
                {tag}
              </span>
            ))}
        </div>
      </div>
      {isModalOpen && (
        <ViewSnippet
          card={snippet}
          snippetTags={snippetTags}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
