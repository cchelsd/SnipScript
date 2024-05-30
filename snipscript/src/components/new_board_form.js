import { useEffect, useState, useRef } from "react";
import { SketchPicker } from "react-color"; 

export default function BoardForm({closeModal, updateBoards}) {

    const [name, setName] = useState(null);
    const [color, setColor] = useState(null);
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const pickerRef = useRef(null);
    const user = localStorage.getItem("Current user id");

    useEffect(() => {
      const handleClickOutside = (e) => {
        if (pickerRef.current && !pickerRef.current.contains(e.target)) {
          setDisplayColorPicker(false);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [pickerRef])

    const handleSubmit = (e) => {
      e.preventDefault();
      fetch('https://able-nature-424917-u2.wl.r.appspot.com/api/boards/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user,
            boardName: name,
            color: color
          }),
        })
        .then(response => {
            return response.json();            
        })
        .then(data => {    
          // Fetch updated boards
          if (data.success) {
            closeModal();
            fetch(`http://localhost:3001/api/boards/${user}`)
            .then(response => response.json())
            .then(() => {
              updateBoards()
            })
            .catch(error => {
              console.error('Error fetching boards:', error);
            });
          } else {
            setErrorMessage(data.message);
          } 
        })
        .catch(error => {
          console.error('Error:', error);
        });
    };

    const handleColorChange = (color) => {
      setColor(color.hex);
    }

    return (
        <div id="add-board-modal" className="flex justify-center items-center bg-black fixed z-10 bg-opacity-60 inset-0 left-0 -top-2">
            <div className="bg-white h-3/8 w-1/4 rounded-2xl p-5 max-h-[calc(100vh - 100px] overflow-y-auto">
                <h1 className='text-center mb-4'>Create Board</h1>
                <label htmlFor="name" className="ml-px block pl-4 text-sm font-medium leading-6 text-gray-900">Name</label>
                <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 block w-full rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Enter name"
                required
                />
                <p className='ml-2 mt-1 text-sm text-red-500'>{errorMessage}</p>
                <label htmlFor="color" className="ml-px block pl-4 text-sm font-medium leading-6 text-gray-900 mt-4">Color</label>
                <div className="mt-2">
                  <div className="flex items-center">
                    <div
                      className="w-10 h-10 rounded-md outline outline-1 cursor-pointer"
                      style={{ backgroundColor: color }}
                      onClick={() => setDisplayColorPicker(!displayColorPicker)}
                    />
                    <p className="ml-4">{color ? color : "#FFFFFF"}</p>
                  </div>
                  {displayColorPicker && (
                    <div ref={pickerRef} className="absolute z-20 mt-2">
                      <SketchPicker color={'#FFFFFF'} onChange={handleColorChange} />
                    </div>
                  )}
                </div>
                <div className="flex justify-between">
                    <button onClick={() => {closeModal()}} className='rounded-full bg-gray-900 text-white px-6 py-2 mt-4'>Close</button>
                    <button onClick={handleSubmit} className='rounded-full bg-gray-900 text-white px-6 py-2 mt-4'>Create board</button>
                </div>
            </div>
        </div>
    )
}