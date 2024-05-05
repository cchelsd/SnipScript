import React, { useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useState } from 'react';
import SnippetForm from './snippet_card_form';

const ListCard = ({ card, index, updateCard }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);


  return (
    <>
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div className="bg-white p-2 rounded-xl shadow-lg mb-4" {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} onClick={() => setIsModalOpen(true)}>
          <h4 className="text-lg font-semibold mb-2">{card.title}</h4>
          <p className="text-sm text-gray-600 mb-2">{card.description}</p>
          <div className="flex flex-wrap">
            {card.tags.map((tag, index) => (
              <span key={index} className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs mr-2 mb-2" >{tag}</span>
            ))}
          </div>
        </div>
      )}
    </Draggable>
    {isModalOpen && <SnippetForm card={card} closeModal={() => setIsModalOpen(false)} updateCard={updateCard} />}
    </>
  );
};

export default ListCard;
