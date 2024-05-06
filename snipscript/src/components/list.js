import React from 'react';
import ListCard from './list_card';
import { Droppable } from 'react-beautiful-dnd';
import { useEffect, useState } from 'react';

const List = ({ list, index, handleUpdateCard }) => {

  const [ enabled, setEnabled ] = useState(false);

  useEffect(() => {
      const animation = requestAnimationFrame(() => setEnabled(true));
      return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
      console.log("List id::", list.id);
      };
  }, []);

  if (!enabled) {
      return null;
  }

  return (
    <div className="flex-1 p-3 rounded-xl bg-gray-200 m-3">
      <h3 className="text-lg font-semibold mb-4 bg-white p-3 rounded-2xl text-center shadow-lg">{list.title}</h3>
      <Droppable droppableId={list.id}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
            {list.cards.map((card, index) => (
              <ListCard key={card.id} card={card} index={index} updateCard={handleUpdateCard} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <div className="mt-4 bg-white rounded-xl p-2 cursor-pointer text-center">Add a card +</div>
    </div>
  );
};

export default List;
