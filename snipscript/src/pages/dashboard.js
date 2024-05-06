import BoardCard from "../components/board_card";
import EmptyState from "../components/empty_state_board";
import ListForm from "../components/list_form";
import Test from "../components/test";
import { useEffect } from "react";

export default function Dashboard() {


    useEffect(() => {
        fetch('http://localhost:3001/boards')
            .then(response => {
                if (!response.ok) {
                throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Data:', data);
                // Handle the data received from the server
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle any errors that occurred during the fetch
            });
    })

    


return (
    <>
        <div class="h-full flex w-full justify-center items-center">
            <div class="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 md:p-2 xl:p-5">
                <EmptyState/>
                <BoardCard/>
            </div>
        </div>
    </>
)};