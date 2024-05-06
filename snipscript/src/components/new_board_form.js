import { useEffect, useState } from "react";

export default function BoardForm({closeModal}) {

    const [name, setName] = useState('');
    const [background, setBackground] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        closeModal();
    };

    return (
        <div id="add-board-modal" className="flex justify-center items-center bg-black fixed z-10 bg-opacity-60 inset-0 left-0 -top-2">
            <div className="bg-white h-3/4 w-2/4 rounded-2xl p-5 max-h-[calc(100vh - 100px] overflow-y-auto">
                <h1 className='text-center mb-4'>Create Board</h1>
                <label htmlFor="name" className="ml-px block pl-4 text-sm font-medium leading-6 text-gray-900">Name</label>
                <input
                type="text"
                id="name"
                value={name}
                // onChange={(e) => setTitle(e.target.value)}
                className="mt-2 block w-full rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Enter name"
                />
                <label htmlFor="description" className="ml-px block pl-4 text-sm font-medium leading-6 text-gray-900 mt-5">Description</label>
                <textarea
                type="text"
                id="description"
                // value={description}
                // onChange={(e) => setDescription(e.target.value)}
                className="mt-2 block w-full rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Enter description"
                />
                <div className="flex justify-end">
                    <button onClick={handleSubmit} className='rounded-full bg-gray-900 text-white px-6 py-2 mt-4'>Create board</button>
                </div>
            </div>
        </div>
    )
}