import React from 'react';
import List from '../components/list';
import { DragDropContext } from 'react-beautiful-dnd';
import { useEffect, useState } from 'react';

const Board = ({ lists: paramLists, onDragEnd }) => {

  const [lists, setLists] = useState(paramLists);

  const handleUpdateCard = (updatedCard) => {
    const updatedLists = [...lists];
    updatedLists.forEach(list => {
      list.cards.forEach((card, index) => {
        if (card.id === updatedCard.id) {
          list.cards[index] = updatedCard;
        }
      });
    });
    setLists(updatedLists);
  };

  return (
    // Set color here
    <div className='h-full'>
      <div className='flex justify-between px-4 bg-white h-12 items-center text-lg font-semibold rounded-xl m-3 shadow-lg'>
        <h1>Board Name</h1>
        <button className='bg-red-600 px-4 py-1 text-sm rounded-md text-white'>Delete Board</button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-row">
          {lists.map((list, index) => (
            <List key={list.id} list={list} index={index} handleUpdateCard={handleUpdateCard} />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};


export default Board;