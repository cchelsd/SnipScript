export default function BoardCard() {
    return (
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
                            Board Name
                        </h5>
                    </a>
                    <p className="antialiased text-gray-600 text-sm break-all">
                        # of snippets
                    </p>
                </div>
            </div>
        </div>
    )
};