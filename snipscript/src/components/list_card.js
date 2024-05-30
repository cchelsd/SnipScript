import React, { useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useState } from 'react';
import SnippetForm from './snippet_card_form';
import ViewSnippet from './snippet_modal';

const ListCard = ({ card, index, updateCard }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snippetData, setSnippetData] = useState(null);
  const [snippetTags, setSnippetTags] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://able-nature-424917-u2.wl.r.appspot.com/api/snippet/${card.id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSnippetData(data[0]);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [card]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`https://able-nature-424917-u2.wl.r.appspot.com/api/snippet/tags/${card.id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSnippetTags(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchTags();
  }, [card]);

  return (
    <div>
    {snippetData && snippetTags ? (
        <Draggable draggableId={card.id.toString()} index={index}>
          {(provided) => (
            <div className="bg-white p-2 rounded-xl shadow-lg mb-4" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} onClick={() => setIsModalOpen(true)}>
              <h4 className="text-lg font-semibold mb-2">{snippetData.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{snippetData.snippet_description}</p>
              <div className="flex flex-wrap">
                {snippetTags.tags.map((tag, index) => (
                  <span key={index} className="bg-violet-200 text-violet-800 px-2 py-1 rounded-full text-xs mr-2 mb-2" >{tag}</span>
                ))}
              </div>
            </div>
          )}
        </Draggable>
      ) : null}
      {/* {isModalOpen && <SnippetForm card={snippetData} snippetTags={snippetTags} closeModal={() => setIsModalOpen(false)} updateCard={updateCard} />} */}
      {isModalOpen && <ViewSnippet card={snippetData} snippetTags={snippetTags} closeModal={() => setIsModalOpen(false)} updateCard={updateCard}/>}
    </div>
  );
};

export default ListCard;
