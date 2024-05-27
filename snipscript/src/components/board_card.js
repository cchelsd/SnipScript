import { useEffect } from "react"
import { Link } from "react-router-dom"

export default function BoardCard({ board, snippets }) {
    useEffect(() => {
        console.log("Board Color", board.color)
        console.log("Board", board)
    }, []);

    return (
        <Link to={`/board/${encodeURIComponent(board.board_name)}/${board.id}`} className="relative bg-white border rounded-lg shadow-md transform transition duration-500 hover:scale-105 z-0">
            <div className="relative bg-white border rounded-lg shadow-md transform transition duration-500 hover:scale-105">
                <div className="p-2 flex justify-center">
                    <div className='rounded-md w-full h-48' style={{backgroundColor: board.color, ...(board.color === '#FFFFFF' ? {outline: `1px solid #000000`} : {})}}></div>
                </div>

                <div className="px-4 pb-3">
                    <div>
                        <h5
                            className="text-xl font-semibold tracking-tight hover:text-violet-800 text-gray-900">
                            {board.board_name}
                        </h5>
                        <p className="antialiased text-gray-600 text-md break-all">
                            {snippets} snippets
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    )
};