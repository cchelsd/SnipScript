import React from 'react';
import List from '../components/list';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Board = () => {

  const [lists, setLists] = useState([]);
  const [listName, setListName] = useState("");
  const [openListModal, setOpenListModal] = useState(false);
  const { boardName, boardId } = useParams();
  const userId = localStorage.getItem("Current user id");

  const navigate = useNavigate();

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
        const groupedLists = data.reduce((acc, { list_name, id, snippet_id }) => {
          if (!acc[list_name]) {
            acc[list_name] = { id, snippetIds: [] };
          }
          if (snippet_id !== null) {
            acc[list_name].snippetIds.push(snippet_id);
          }
          return acc;
        }, {});

        // Convert grouped snippets to list objects
        const lists = Object.entries(groupedLists).map(([listName, { id, snippetIds }]) => ({
          id,
          title: listName,
          cards: snippetIds.map(snippetId => ({ id: snippetId }))
        }));

        // Update the state with the new lists
        setLists(lists);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    console.log("board name", boardName);
    
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
    const destListIndex = destination.index;

    const updatedLists = [...lists];
    const sourceList = updatedLists.find((list) => list.id === source.droppableId);
    const destList = updatedLists.find((list) => list.id === destination.droppableId);

    const [movedCard] = sourceList.cards.splice(sourceListIndex, 1);
    destList.cards.splice(destListIndex, 0, movedCard);

    setLists(updatedLists);
    // Make a request to update the database
    fetch(`http://localhost:3001/snippet/drag/${destination.droppableId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ snippetId: draggableId }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      } else {
        console.log('Successfully moved snippet to different list')
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  const handleDelete = () => {
    fetch(`http://localhost:3001/boards/${boardId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      } else {
        console.log('Successfully deleted board');
        navigate('/dashboard');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  const handleAddList = () => {
    fetch(`http://localhost:3001/lists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: userId, boardId: boardId, listName: listName}),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      } else {
        console.log('Successfully added list');
        fetchLists();
        setOpenListModal(false);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  return (
    // Set color here
    <div className='h-full'>
      <div className='flex justify-between px-4 bg-white h-12 items-center text-lg font-semibold rounded-xl m-3 shadow-lg'>
        <h1>{boardName}</h1>
        <button onClick={handleDelete} className='bg-red-600 px-4 py-1 text-sm rounded-md text-white'>Delete Board</button>
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
      <div className='text-center p-2 bg-white rounded-xl w-2/12 cursor-pointer' onClick={() => setOpenListModal(true)}>Add a list +</div>
      {openListModal && (
        <div className="flex justify-center items-center bg-black fixed z-1 bg-opacity-60 inset-0 left-0 -top-2">
          <div className="bg-white h-1/4 w-2/4 rounded-2xl p-5 max-h-[calc(100vh - 100px] overflow-y-auto">
                <h1 className='text-center mb-4'>Create List</h1>
                <label htmlFor="name" className="ml-px block pl-4 text-sm font-medium leading-6 text-gray-900">Name</label>
                <input
                type="text"
                id="name"
                onChange={(e) => setListName(e.target.value)}
                className="mt-2 block w-full rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Enter name"
                />
                <div className="flex justify-between">
                    <button onClick={() => setOpenListModal(false)} className='rounded-full bg-gray-900 text-white px-6 py-2 mt-4'>Close</button>
                    <button onClick={handleAddList} className='rounded-full bg-gray-900 text-white px-6 py-2 mt-4'>Create List</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};


export default Board;