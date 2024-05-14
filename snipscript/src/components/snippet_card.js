import React, { useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useState } from 'react';
import SnippetForm from './snippet_card_form';
import ViewSnippet from './snippet_modal';

export default function SnippetCard({ snippet }) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snippetData, setSnippetData] = useState([]);
  const [snippetTags, setSnippetTags] = useState(null);

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg mb-4" onClick={() => setIsModalOpen(true)}>
        <p className="text-sm text-gray-500 mb-2">{snippet.username}</p>
        <h4 className="text-xl font-semibold mb-2">{snippet.title}</h4>
        <p className="text-sm text-gray-600 mb-2">{snippet.snippet_description}</p>
        {/* <div className="flex flex-wrap">
            {snippetTags.tags.map((tag, index) => (
                <span key={index} className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs mr-2 mb-2" >{tag}</span>
            ))}
        </div> */}
    </div>
  );
};