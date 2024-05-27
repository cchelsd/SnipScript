import BoardCard from "../components/board_card";
import EmptyState from "../components/empty_state_board";
import SnippetCard from "../components/snippet_card";
import { useEffect, useState } from "react";

export default function Dashboard() {

    const [boards, setBoards] = useState([]);
    const [recentSnippets, setRecentSnippets] = useState([]);

    const user = localStorage.getItem("Current user id");

    const fetchBoards = () => {
        if (user) {
            fetch(`http://localhost:3001/boards/${user}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                }})
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    setBoards(data);
                })
                .catch(error => {
                    console.error('Error:', error);
            });
        }
    };

    const fetchRecentSnippets = () => {
        if (user) {
          fetch(`http://localhost:3001/analytics/recent?user_id=${user}`, {
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
              setRecentSnippets(data);
            })
            .catch((error) => {
              console.error("Error fetching recent snippets:", error);
            });
        }
    };
    

    useEffect(() => {
        fetchBoards();
        fetchRecentSnippets();
    }, []);

    
return (
    <div className="h-full overflow-y-auto">
        <div className="flex flex-col items-center justify-center w-full bg-transparent">
            <div>
                <h1 className="mt-16 ml-5 text-3xl font-medium text-white">Your most recent snippets</h1>
            </div>
            <div className="flex items-center justify-center w-full overflow-auto">
                {recentSnippets.length > 0 ? (
                    <div className="grid w-5/6 grid-cols-1 gap-5 p-4 mx-12 mt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 md:p-2 xl:p-5">
                    {recentSnippets.map(snippet => (
                        <SnippetCard key={snippet.id} snippet={snippet} isUsers={() => fetchRecentSnippets()} isRecent={true}/>
                    ))}
                    </div>
                ) : (
                    <div className="w-full">
                        <p className="my-5 text-lg text-white text-center">No snippets added</p>
                    </div>
                )}
            </div>
        </div>
        <div className="flex w-11/12 mx-auto justify-center items-center z-0">
            <div className="grid w-11/12 gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 md:p-2 xl:p-5">
                <EmptyState updateBoards={fetchBoards}/>
                {boards.map(board => (
                    <BoardCard key={board.id} snippets={board.num_of_snippets} board={board} />
                ))}
            </div>
        </div>
    </div>
)};