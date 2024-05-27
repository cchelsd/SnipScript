import React, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react'
import CodeEditor from './code_editor';
import LanguageSelector from './language_selector';
import { useParams } from 'react-router-dom';

export default function SnippetForm ({ card, snippetTags, closeModal, updateCard, isAdding, listId }) {
  const cardData = {
    title: card ? card.title : null,
    description: card ? card.snippet_description : null,
    tags: snippetTags ? snippetTags.tags.join(', ') : [],
    code: card ? card.code_content : null,
    language: card ? card.code_language : "",
    publicSetting: card ? card.privacy === 0 : false
  }

  const [title, setTitle] = useState(cardData.title);
  const [description, setDescription] = useState(cardData.description);
  const [tags, setTags] = useState(cardData.tags);
  const [code, setCode] = useState(cardData.code);
  const [language, setLanguage] = useState(cardData.language);
  const [publicSetting, setPublicSetting] = useState(cardData.publicSetting);
  const [isMissing, setIsMissing] = useState(false)

  const endpoint = isAdding ? `http://localhost:3001/snippet` : `http://localhost:3001/snippet/${card.id}`;
  const method = isAdding ? 'POST' : 'PUT'
  const userId = parseInt(localStorage.getItem("Current user id"));

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

// const codeString = "(num) => num + 1";

//   useEffect(() => {
//     console.log("Card: ", card);
//     console.log("Card: ", cardData);
// }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const tagsString = String(tags);
    const tagsArray = tagsString.trim() === '' ? [] : tagsString.split(',').map(tag => tag.trim());
    const addCardData = {
      userId: userId,
      listId: listId,
      title: title,
      description: description,
      code: code,
      language: language,
      privacy: publicSetting ? 0 : 1,
      tags: tagsArray
    };

    console.log("Card data", addCardData);
    console.log("Tags", tags);
    fetch(endpoint, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(addCardData),
    })
    .then(response => {
        if (!response.ok) {
          setIsMissing(true)
            throw new Error('Network response was not ok');
        } else {
          setIsMissing(false)
          return response.json();
        }
    })
    .then(data => {
      if (typeof updateCard === 'function') {
        updateCard();
      }
      closeModal();
    })
    .catch(error => {
        console.error('Error:', error);
    });
  };


  return (
    <div id="add-snippet-modal" className="flex justify-center items-center bg-black fixed z-30 bg-opacity-60 inset-0 left-0 -top-2">
      <div className="bg-white h-3/4 w-2/4 rounded-2xl p-5 max-h-[calc(100vh - 100px] overflow-y-auto">
        <h1 className='text-center'>{isAdding ? 'Add Snippet' : 'Edit Snippet'}</h1>
        <p className='text-sm mb-4'>* Required fields</p>
        <label htmlFor="title" className="ml-px block pl-4 text-sm font-medium leading-6 text-gray-900">Title *</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-2 block w-full rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Enter title"
          required
        />
        <label htmlFor="description" className="ml-px block pl-4 text-sm font-medium leading-6 text-gray-900 mt-5">Description *</label>
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
          placeholder="Enter tags (comma separated, one word per tag)"
        />
        <p className='ml-px block pl-4 text-sm font-medium leading-6 text-gray-900 mt-5'>Code *</p>
        <div className='mt-2 w-full min-w-[25rem] bg-[#3a404d] rounded-md overflow-hidden'>
          <div className='flex p-3 text-white text-xs items-center'>
            <LanguageSelector onChange={(value) => setLanguage(value)} setLanguage={setLanguage} defaultLanguage={language} />
            {/* <button className='py-1 inline-flex items-center gap-1' onClick={() => {setTimeout(() => {navigator.clipboard.writeText(codeString)}, 0)}}>Copy code</button> */}
          </div>
          <CodeEditor initialValue={code} onChange={(value) => setCode(value)} language={language}/>
        </div>
        <Switch.Group as="div" className="flex items-center mt-4">
            <Switch.Label as="span" className="ml-3 text-sm">
                <span className="font-medium text-gray-900 mr-4">{publicSetting ? 'Public' : 'Private'}</span>{' '}
            </Switch.Label>
            <Switch
                checked={publicSetting}
                onChange={() => setPublicSetting(!publicSetting)}
                className={classNames(
                    publicSetting ? 'bg-indigo-600' : 'bg-gray-200',
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
                )}
            >
                <span
                    aria-hidden="true"
                    className={classNames(
                        publicSetting ? 'translate-x-5' : 'translate-x-0',
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                    )}
                />
            </Switch>
        </Switch.Group>
        <div className="flex justify-between">
          <button onClick={() => {closeModal(); setIsMissing(false)}} className='rounded-full bg-gray-900 text-white px-6 py-2 mt-4'>Close</button>
          <div className='flex flex-row'>
            {isMissing && <p className='text-black text-sm mt-6 mr-2'>Missing required field(s)</p>}
            <button onClick={handleSubmit} className='rounded-full bg-gray-900 text-white px-6 py-2 mt-4'>Save Changes</button>
          </div>  
        </div>
      </div>
    </div>
  );
};