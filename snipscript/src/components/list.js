import React from 'react';
import ListCard from './list_card';
import { Droppable } from 'react-beautiful-dnd';
import { useEffect, useState } from 'react';
import SnippetForm from './snippet_card_form';

const List = ({ list, index, handleUpdateCard }) => {

  const [ enabled, setEnabled ] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
      const animation = requestAnimationFrame(() => setEnabled(true));
      return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
      console.log("List id:", list.id);
      };
  }, []);

  if (!enabled) {
      return null;
  }

  return (
    <div className="flex-1 h-full p-3 rounded-xl bg-gray-200 m-3 min-w-72">
      <h3 className="text-lg font-semibold mb-4 bg-white p-3 rounded-2xl text-center shadow-lg">{list.title}</h3>
      <Droppable droppableId={list.id}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2 min-h-1">
            {list.cards.map((card, index) => (
              <ListCard key={card.id} card={card} index={index} updateCard={handleUpdateCard} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <div className="mt-4 bg-white rounded-xl p-2 cursor-pointer text-center"  onClick={() => setIsModalOpen(true)}>Add a card +</div>
      {isModalOpen && <SnippetForm closeModal={() => setIsModalOpen(false)} isAdding={true} listId={list.id} updateCard={handleUpdateCard} />}
    </div>
  );
};

export default List;
