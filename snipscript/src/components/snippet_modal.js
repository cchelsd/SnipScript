import CodeSnippet from "./code_snippet";
import { useEffect, useState, useRef } from "react";
import { Switch } from "@headlessui/react";
import SnippetForm from "./snippet_card_form";

export default function ViewSnippet ({ card, snippetTags, closeModal, updateCard }) {

    const [isEditing, setIsEditing] = useState(false);
    const [isBookmarked, setBookmarked] = useState(false);
    const [isUpvoted, setIsUpvoted] = useState(false);
    const [numOfViews, setNumOfViews] = useState(card.numOfViews);
    const [numOfUpvotes, setNumOfUpvotes] = useState(card.rating);
    const [numOfBookmarked, setNumOfBookmarked] = useState(0);

    const userId = localStorage.getItem("Current user id");

    const getUpvoteSvg = (isUpvoted) => {
        return isUpvoted ? "M4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14z" : "M12.781 2.375c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10zM15 12h-1v8h-4v-8H6.081L12 4.601 17.919 12H15z"
    }

    useEffect(() => {
        if (!updateCard) {
            const newNumOfViews = numOfViews + 1;
            handleUpdateStats(newNumOfViews, undefined);
        }
        const fetchBookmarked = async () => {
            try {
              const response = await fetch(`http://localhost:3001/bookmark/${userId}/${card.id}`);
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              const data = await response.json();
              setBookmarked(data[0].is_bookmarked);
            } catch (error) {
              console.error('Error:', error);
            }
        };

        const upvotedSnippets = JSON.parse(localStorage.getItem('upvotedSnippets')) || {};
        setIsUpvoted(!!upvotedSnippets[card.id]);
        fetchBookmarked();
    }, [updateCard]);

    const handleEdit = () => {
        setIsEditing(true);
    }

    const handleAddBookmark = () => {
        fetch(`http://localhost:3001/bookmark`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: userId, snippetId: card.id}),
            })
            .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                console.log('Successfully added bookmark');
            }
            })
            .catch(error => {
            console.error('Error:', error);
        });
    }

    const handleDeleteBookmark = () => {
        fetch(`http://localhost:3001/bookmark`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: userId, snippetId: card.id}),
            })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            } else {
              console.log('Successfully deleted bookmark');
            }
          })
          .catch(error => {
            console.error('Error:', error);
        });
    }

    const handleUpdateStats = async (numOfViews, numOfUpvotes) => {
        const body = {};
    
        if (numOfViews !== undefined) {
          body.numOfViews = numOfViews;
        }
    
        if (numOfUpvotes !== undefined) {
          body.rating = numOfUpvotes;
        }
    
        if (Object.keys(body).length > 0) {
          try {
            const response = await fetch(`http://localhost:3001/snippet/stats/${card.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            });
    
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            setNumOfUpvotes(data.numOfUpvotes);
            setNumOfViews(data.numOfViews);
            console.log("NumOfViews", numOfViews);
            console.log('Snippet stats updated successfully');
          } catch (error) {
            console.error('Error:', error);
          }
        }
    };

    const handleUpvote = () => {
        const newIsUpvoted = !isUpvoted;
        const newUpvotes = newIsUpvoted ? numOfUpvotes + 1 : numOfUpvotes - 1;
        setIsUpvoted(newIsUpvoted);
        handleUpdateStats(undefined, newUpvotes);
    
        const upvotedSnippets = JSON.parse(localStorage.getItem('upvotedSnippets')) || {};
        if (newIsUpvoted) {
            upvotedSnippets[card.id] = true;
        } else {
            delete upvotedSnippets[card.id];
        }
        localStorage.setItem('upvotedSnippets', JSON.stringify(upvotedSnippets));
    };

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
  
    return (
    <>
    {!isEditing ? (
      <div id="view-snippet-modal" className="flex justify-center items-center bg-black fixed z-40 bg-opacity-60 inset-0 left-0 -top-2">
        <div className="bg-white h-3/4 w-2/4 rounded-2xl p-5 max-h-[calc(100vh - 100px] overflow-y-auto">
            <div className="flex justify-between">
                {updateCard ? (
                    <span className="bg-violet-200 text-violet-800 px-2 py-1 rounded-full text-xs mr-2 mb-3" >{card.privacy === 0 ? 'Public' : 'Private'}</span>
                ) : (
                    <>
                        <div className="text-black flex">
                            <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" onClick={handleUpvote} className="cursor-pointer mr-4"><path d={getUpvoteSvg(isUpvoted)}/></svg>
                            <p>{numOfUpvotes} upvotes</p>
                        </div>
                        <div className="text-black">
                            <p>{numOfViews} views</p>
                        </div>
                        <div className="text-white flex">
                            <p>{numOfBookmarked} bookmark</p>
                            <svg fill="#000000" onClick={() => {setBookmarked(!isBookmarked); !isBookmarked ? handleAddBookmark() : handleDeleteBookmark()}} width="25px" height="25px" viewBox="0 0 24 24" id="bookmark" data-name="Line Color" xmlns="http://www.w3.org/2000/svg" class="icon line-color" className="cursor-pointer ml-4"><path id="primary" d="M12,17,5,21V4A1,1,0,0,1,6,3H18a1,1,0,0,1,1,1V21Z"
                                style={{
                                fill: isBookmarked ? "#000000" : "none",
                                stroke: "rgb(0, 0, 0)",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                }}
                            /></svg>    
                        </div>
                    </>
                    
                )} 
            </div>
            <div className='flex flex-col'>
                <h1 className='text-gray-900 text-center text-2xl my-5 font-semibold'>{card.title}</h1>
                <h1 className='text-gray-900 text-lg font-semibold mb-2'>Description</h1>
                <p className="mb-3">{card.snippet_description}</p>
                <h1 className='text-gray-900 text-lg font-semibold mb-2'>Tags</h1>
                <div className="flex flex-wrap">
                    {snippetTags.tags.map((tag, index) => (
                    <span key={index} className="bg-violet-200 text-violet-800 px-2 py-1 rounded-full text-xs mr-2 mb-3" >{tag}</span>
                    ))}
                </div>
                <h1 className='text-gray-900 text-lg font-semibold'>Snippet</h1>
                <div className='mt-2 w-full min-w-[25rem] bg-[#3a404d] rounded-md overflow-hidden'>
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
                    {updateCard && (
                        <button onClick={() => handleEdit()}className='rounded-full bg-gray-900 text-white px-6 py-2 mt-4'>Edit</button>
                    )}
                </div>  
            </div>   
        </div>
      </div>
    ) : <SnippetForm card={card} snippetTags={snippetTags} closeModal={closeModal} updateCard={updateCard} isAdding={false}/> }    
    </>
    );
  };