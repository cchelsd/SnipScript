import React, { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import CodeEditor from './code_editor';
import LanguageSelector from './language_selector';

export default function SnippetForm ({ card, closeModal, updateCard }) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [tags, setTags] = useState(card.tags.join(', ')); // Convert array to string for easier editing
  const [code, setCode] = useState(card.code);
  const [language, setLanguage] = useState('javascript');

  const codeString = "(num) => num + 1";

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update the card data
    const updatedCard = {
      ...card,
      title: title,
      description: description,
      tags: tags.split(', '),
      code: code,
    };
    updateCard(updatedCard);
    closeModal();
  };


  return (
    <div id="add-snippet-modal" className="flex justify-center items-center bg-black fixed z-1 bg-opacity-60 inset-0 left-0 -top-2">
      <div className="bg-white h-3/4 w-2/4 rounded-2xl p-5 max-h-[calc(100vh - 100px] overflow-y-auto">
        <h1 className='text-center'>Edit Snippet</h1>
        <label htmlFor="title" className="ml-px block pl-4 text-sm font-medium leading-6 text-gray-900">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-2 block w-full rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Enter title"
        />
        <label htmlFor="description" className="ml-px block pl-4 text-sm font-medium leading-6 text-gray-900 mt-5">Description</label>
        <textarea
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-2 block w-full rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Enter description"
        />
        <label htmlFor="tags" className="ml-px block pl-4 text-sm font-medium leading-6 text-gray-900 mt-5">Tags</label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="mt-2 block w-full rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Enter tags (comma separated)"
        />
        <p className='ml-px block pl-4 text-sm font-medium leading-6 text-gray-900 mt-5'>Code</p>
        <div className='mt-2 max-w-2xl min-w-[25rem] bg-[#3a404d] rounded-md overflow-hidden'>
          <div className='flex justify-between p-3 text-white text-xs items-center'>
            <LanguageSelector setLanguage={setLanguage}/>
            <button className='py-1 inline-flex items-center gap-1' onClick={() => {setTimeout(() => {navigator.clipboard.writeText(codeString)}, 0)}}>Copy code</button>
          </div>
          <CodeEditor initialValue={code} onChange={(value) => setCode(value)} language={language}/>
        </div>
        <div className="flex justify-end">
          <button onClick={handleSubmit} className='rounded-full bg-black text-white px-6 py-2 mt-4'>Save Changes</button>
        </div>
      </div>
    </div>
  );
};