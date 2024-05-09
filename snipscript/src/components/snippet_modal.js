import CodeSnippet from "./code_snippet";
import { useState } from "react";
import SnippetForm from "./snippet_card_form";

export default function ViewSnippet ({ card, snippetTags, closeModal, updateCard }) {

    const [isEditing, setIsEditing] = useState(false);


    const handleEdit = () => {
        setIsEditing(true);
    }
  
    // const [title, setTitle] = useState(cardData.title);
    // const [description, setDescription] = useState(cardData.description);
    // const [tags, setTags] = useState(cardData.tags);
    // const [code, setCode] = useState(cardData.code);
    // const [language, setLanguage] = useState(cardData.language);
  
    return (
    <>
    {!isEditing ? (
      <div id="view-snippet-modal" className="flex justify-center items-center bg-black fixed z-1 bg-opacity-60 inset-0 left-0 -top-2">
        <div className="bg-white h-3/4 w-2/4 rounded-2xl p-5 max-h-[calc(100vh - 100px] overflow-y-auto">
            <h1 className='text-gray-900 text-center text-2xl mb-4 font-semibold'>{card.title}</h1>
            <h1 className='text-gray-900 text-lg font-semibold mb-2'>Description</h1>
            <p className="mb-3">{card.snippet_description}</p>
            <h1 className='text-gray-900 text-lg font-semibold mb-2'>Tags</h1>
            <div className="flex flex-wrap">
                {snippetTags.tags.map((tag, index) => (
                <span key={index} className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs mr-2 mb-3" >{tag}</span>
                ))}
            </div>
            <h1 className='text-gray-900 text-lg font-semibold'>Snippet</h1>
            <div className='mt-2 max-w-2xl min-w-[25rem] bg-[#3a404d] rounded-md overflow-hidden'>
                <div className='flex justify-between p-3 text-white text-xs items-center'>
                    <h1>{card.code_language}</h1>
                    {/* <LanguageSelector setLanguage={setLanguage} defaultLanguage={language} /> */}
                    <button className='py-1 inline-flex items-center gap-1' onClick={() => {setTimeout(() => {navigator.clipboard.writeText(card.code_content)}, 0)}}>
                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-5-4v4h4V3h-4Z"/>
                        </svg>
                        Copy code
                    </button>
                </div>
                <CodeSnippet code={card.code_content} language={card.code_language} />
            </div>
            <div className="flex justify-between mt-12">
                <button onClick={() => closeModal()} className='rounded-full bg-gray-900 text-white px-6 py-2 mt-4'>Close</button>
                <button onClick={() => handleEdit()}className='rounded-full bg-gray-900 text-white px-6 py-2 mt-4'>Edit</button>
            </div>     
        </div>
      </div>
    ) : <SnippetForm card={card} snippetTags={snippetTags} closeModal={closeModal} updateCard={updateCard} isAdding={false}/> }    
    </>
    );
  };