import { useEffect } from "react"
import { Link } from "react-router-dom"

export default function BoardCard({ board, snippets }) {

    useEffect(() => {
        console.log("Board data", board);
    }, []);
    return (
        <Link to={`/board/${encodeURIComponent(board.board_name)}/${board.id}`} className="relative bg-white border rounded-lg shadow-md transform transition duration-500 hover:scale-105">
            <div className="relative bg-white border rounded-lg shadow-md transform transition duration-500 hover:scale-105">
                <div className="p-2 flex justify-center">
                    <a href="#">
                        <img className="rounded-md"
                        src="https://tailwindflex.com/public/images/thumbnails/coming-soon-page/thumb_u.min.webp"
                        loading="lazy"/>
                    </a>
                </div>

                <div className="px-4 pb-3">
                    <div>
                        <a href="#">
                            <h5
                                className="text-xl font-semibold tracking-tight hover:text-violet-800 text-gray-900">
                                {board.board_name}
                            </h5>
                        </a>
                        <p className="antialiased text-gray-600 text-md break-all">
                            {snippets} snippets
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    )
};