import BoardCard from "../components/board_card";
import EmptyState from "../components/empty_state_board";
import ListForm from "../components/list_form";
import Test from "../components/test";

export default function Dashboard() {

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