import BoardCard from "../components/board_card";
import EmptyState from "../components/empty_state_board";
import ListForm from "../components/list_form";
import Test from "../components/test";
import { useEffect, useState } from "react";

export default function Dashboard() {

    const [boards, setBoards] = useState([]);
    const user = localStorage.getItem("Current user id");


    useEffect(() => {
        if (user) {
            fetch(`http://localhost:3001/boards/${user}`)
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
    }, [])

    
return (
    <>
        <div class="flex w-full justify-center items-center bg-transparent overflow-auto">
            <div class="mt-48 grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 md:p-2 xl:p-5">
                <EmptyState/>
                {boards.map(board => (
                    <BoardCard key={board.id} board={board} />
                ))}
            </div>
        </div>
    </>
)};