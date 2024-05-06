import { useState } from "react";
import BoardForm from "./new_board_form";
export default function EmptyState() {

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="relative block w-full h-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
            <svg className="mx-auto w-20 h-20 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 10h18M6 14h2m3 0h5M3 7v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1Z"/>
            </svg>
            <span className="mt-2 block text-sm font-semibold text-white">Create a new board</span>
            </button>
            {isModalOpen && <BoardForm closeModal={() => setIsModalOpen(false)} />}
        </div>
    )
}
  