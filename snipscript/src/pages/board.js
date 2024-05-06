import React from 'react';
import List from '../components/list';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Board = () => {

  const [lists, setLists] = useState([]);
  const { boardId } = useParams();

  const fetchLists = () => {
    fetch(`http://localhost:3001/lists/${boardId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Group snippets by list_name
        const groupedLists = data.reduce((acc, { list_name, snippet_id }) => {
          if (!acc[list_name]) {
            acc[list_name] = [];
          }
          if (snippet_id) {
            acc[list_name].push(snippet_id);
          }
          return acc;
        }, {});

        // Convert grouped snippets to list objects
        const newLists = Object.entries(groupedLists).map(([listName, snippetIds]) => ({
          title: listName,
          cards: snippetIds.map(snippetId => ({ id: snippetId }))
        }));

        // Update the state with the new lists
        setLists(newLists);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    fetchLists();
  }, [boardId]);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // If there is no destination, or if the draggable is dropped back to its original position, do nothing
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    // Reorder the cards in the source and destination lists
    const sourceListIndex = source.index;

    console.log("Source list index:", sourceListIndex);
    const destListIndex = destination.index;

    const updatedLists = [...lists];
    const sourceList = updatedLists.find((list) => list.title === source.droppableId);
    const destList = updatedLists.find((list) => list.title === destination.droppableId);

    const [movedCard] = sourceList.cards.splice(sourceListIndex, 1);
    destList.cards.splice(destListIndex, 0, movedCard);

    // Update the state with the new lists order
    setLists(updatedLists);
  };

  return (
    // Set color here
    <div className='h-full'>
      <div className='flex justify-between px-4 bg-white h-12 items-center text-lg font-semibold rounded-xl m-3 shadow-lg'>
        <h1>Board Name</h1>
        <button className='bg-red-600 px-4 py-1 text-sm rounded-md text-white'>Delete Board</button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={boardId.toString()}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-row">
              {lists.map((list, index) => (
                <List key={list.id} list={list} index={index} handleUpdateCard={fetchLists} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};


export default Board;