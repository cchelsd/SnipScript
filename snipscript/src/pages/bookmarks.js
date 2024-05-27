import { useState, useEffect } from "react";
import SnippetCard from "../components/snippet_card";
import { useNavigate } from "react-router-dom";

export default function Bookmarks() {
  const user = localStorage.getItem("Current user id");
  const [bookmarks, setBookmarks] = useState([]);
  const navigate = useNavigate();

  const fetchBookmarks = () => {
    if (user) {
        fetch(`http://localhost:3001/bookmarks/${user}`, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
        })
        .then((response) => {
            if (!response.ok) {
            throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            setBookmarks(data);
        })
        .catch((error) => {
            console.error("Error fetching bookmarked snippets:", error);
        });
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [user]);

  return (
    <div className="flex flex-col items-center h-full">
      <h1 className="mt-12 mb-12 text-4xl font-semibold text-center text-white">
        BOOKMARKS
      </h1>
      <div className="flex items-center justify-center w-full overflow-auto bg-transparent">
        {bookmarks.length > 0 ? (
          <div className="grid w-5/6 grid-cols-1 gap-5 p-4 mx-12 mt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 md:p-2 xl:p-5">
          {bookmarks.map((snippet) => (
            <SnippetCard key={snippet.id} snippet={snippet} isUsers={true} />
          ))}
          </div>
        ) : (
          <p className="mt-5 text-lg text-white">No bookmarks. Visit the <span className="cursor-pointer underline" onClick={() => navigate('/explore')}>Explore</span> page to start bookmarking.</p>
        )}
      </div>
    </div>
  );
}