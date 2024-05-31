import React from 'react';
import List from '../components/list';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Board = () => {

  const [lists, setLists] = useState([]);
  const [listName, setListName] = useState(null);
  const [openListModal, setOpenListModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { boardName, boardId } = useParams();
  const userId = localStorage.getItem("Current user id");
  

  const navigate = useNavigate();

  const fetchLists = () => {
    fetch(`https://snipscript-3.wl.r.appspot.com/api/lists/${boardId}`)
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
    fetchLists();
  }, [boardId]);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // If there is no destination, or if the draggable is dropped back to its original position, do nothing
    if (!destination || (parseInt(destination.droppableId) === parseInt(source.droppableId) && destination.index === source.index)) {
      return;
    }

    // Reorder the cards in the source and destination lists
    const sourceListIndex = source.index;
    const destListIndex = destination.index;

    const updatedLists = [...lists];
    const sourceList = updatedLists.find((list) => list.id === parseInt(source.droppableId));
    const destList = updatedLists.find((list) => list.id === parseInt(destination.droppableId));

    const [movedCard] = sourceList.cards.splice(sourceListIndex, 1);
    destList.cards.splice(destListIndex, 0, movedCard);

    setLists(updatedLists);
    // Make a request to update the database
    fetch(`https://snipscript-3.wl.r.appspot.com/api/snippet/drag/${parseInt(destination.droppableId)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ snippetId: parseInt(draggableId) }),
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
    fetch(`https://snipscript-3.wl.r.appspot.com/api/boards/${boardId}`, {
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
    fetch(`https://snipscript-3.wl.r.appspot.com/api/lists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: userId, boardId: boardId, listName: listName}),
    })
    .then(response => {
      return response.json();
    })
    .then(data => {
      if (data.success) {
        fetchLists();
        setOpenListModal(false);
      } else {
        setErrorMessage(data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  return (
    // Set color here
    <div className='h-full overflow-y-hidden'>
      <div className='flex justify-between px-4 bg-white h-12 items-center text-lg font-semibold rounded-xl m-3 shadow-lg'>
        <h1>{boardName}</h1>
        <button onClick={handleDelete} className='bg-red-600 px-4 py-1 text-sm rounded-md text-white'>Delete Board</button>
      </div>
      <div className='overflow-auto mr-3 h-full pb-20'>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId={boardId.toString()}>
            {(provided) => (
              <div ref={provided.innerRef} className='flex flex-row'>
                {lists.map((list, index) => (
                  <List key={list.id} list={list} index={index} handleUpdateCard={fetchLists} />
                ))}
                {provided.placeholder}
                <div className='text-center ml-3 mt-3 px-20 bg-white rounded-xl flex items-center h-11 cursor-pointer' onClick={() => setOpenListModal(true)}><span className="whitespace-nowrap">Add a List +</span></div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
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
                required
                />
                <p className='ml-2 mt-1 text-sm text-red-500'>{errorMessage}</p>
                <div className="flex justify-between">
                    <button onClick={() => {setOpenListModal(false); setErrorMessage('')}} className='rounded-full bg-gray-900 text-white px-6 py-2 mt-4'>Close</button>
                    <button onClick={() => {handleAddList(); setErrorMessage('')}} className='rounded-full bg-gray-900 text-white px-6 py-2 mt-4'>Create List</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};


export default Board;