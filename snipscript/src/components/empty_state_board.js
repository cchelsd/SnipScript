import { useState } from "react";
import BoardForm from "./new_board_form";
import { useNavigate } from "react-router-dom";
export default function EmptyState({ updateBoards }) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const user = localStorage.getItem("Current user id");
    const navigate = useNavigate();

    return (
        <div>
            <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="relative block w-full h-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
            <svg className="mx-auto w-20 h-20 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 10h18M6 14h2m3 0h5M3 7v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1Z"/>
            </svg>
            <span className="mt-2 block text-sm font-semibold text-white">Create a new board</span>
            </button>
            {isModalOpen && (
                user ? (
                <BoardForm closeModal={() => setIsModalOpen(false)} updateBoards={updateBoards} />
            ) : (
                <div className="flex justify-center items-center fixed z-50 inset-0 left-0 -top-2">
                    <div className="flex flex-col justify-center items-center bg-white h-1/6 w-2/6 rounded-2xl p-5 max-h-[calc(100vh - 100px] overflow-y-auto shadow-2xl">
                        <h1 className='text-center mb-4'>Please login or create an account to create boards and add code snippets.</h1>
                        <div className="flex justify-between">
                            <button onClick={() => setIsModalOpen(false)} className='rounded-full bg-gray-900 text-white px-6 py-2 mt-4 mr-4'>Close</button>
                            <button onClick={() => navigate('/authentication')} className='rounded-full bg-gray-900 text-white px-6 py-2 mt-4'>Login/Sign Up</button>
                        </div>
                    </div>
                </div>
                )
            )} 
        </div>
    )
}
  