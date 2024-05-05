import React from 'react';
import ListCard from './list_card';
import { Droppable } from 'react-beautiful-dnd';
import { useEffect } from 'react';

const List = ({ list, index, handleUpdateCard }) => {

    const [ enabled, setEnabled ] = React.useState(false);

    useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => {
        cancelAnimationFrame(animation);
        setEnabled(false);
        };
    }, []);

    if (!enabled) {
        return null;
    }

  return (
    <div className="flex-1 p-3 rounded">
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
    </div>
  );
};

export default List;
