import React, { useState, useEffect } from 'react';
import CodeEditor from './code_editor';
import LanguageSelector from './language_selector';

export default function SnippetForm ({ card, snippetTags, closeModal, updateCard, isAdding, listId }) {
  const cardData = {
    title: card ? card.title : "",
    description: card ? card.snippet_description : "",
    tags: snippetTags ? snippetTags.tags.join(', ') : [],
    code: card ? card.code_content : "",
    language: card ? card.code_language : ""
  }

  const [title, setTitle] = useState(cardData.title);
  const [description, setDescription] = useState(cardData.description);
  const [tags, setTags] = useState(cardData.tags); // Convert array to string for easier editing
  const [code, setCode] = useState(cardData.code);
  const [language, setLanguage] = useState(cardData.language);

  const endpoint = isAdding ? `http://localhost:3001/snippet` : `http://localhost:3001/snippet/${card.id}`;
  const method = isAdding ? 'POST' : 'PUT'
  const userId = parseInt(localStorage.getItem("Current user id"));

// const codeString = "(num) => num + 1";

//   useEffect(() => {
//     console.log("Card: ", card);
//     console.log("Card: ", cardData);
// }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const addCardData = {
      userId: userId,
      listId: listId,
      title: title,
      description: description,
      code: code,
      language: language
    };

    console.log("Card data", addCardData);
    fetch(endpoint, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(addCardData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        updateCard();
        closeModal();
    })
    .catch(error => {
        console.error('Error:', error);
    });
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
          required
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
          <div className='flex p-3 text-white text-xs items-center'>
            <LanguageSelector onChange={(value) => setLanguage(value)} setLanguage={setLanguage} defaultLanguage={language} />
            {/* <button className='py-1 inline-flex items-center gap-1' onClick={() => {setTimeout(() => {navigator.clipboard.writeText(codeString)}, 0)}}>Copy code</button> */}
          </div>
          <CodeEditor initialValue={code} onChange={(value) => setCode(value)} language={language}/>
        </div>
        <div className="flex justify-end">
          <button onClick={handleSubmit} className='rounded-full bg-gray-900 text-white px-6 py-2 mt-4'>Save Changes</button>
        </div>
      </div>
    </div>
  );
};