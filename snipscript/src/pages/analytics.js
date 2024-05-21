import { useState } from "react";

export default function Analytics() {

    const [numOfViews, setNumOfViews] = useState(0);
    const [numOfCopies, setNumOfCopies] = useState(0);
    const [numOfUpvotes, setNumOfUpvotes] = useState(0);

    return (
        <div className="flex flex-col justify-center items-center">
            <h1 className="text-4xl text-center text-white font-semibold mt-12 mb-12">SNIPPET ANALYTICS</h1>
            <div className="grid grid-cols-3 w-3/4 gap-10 h-32">
                <div className="bg-white p-3 rounded-[20px] text-center">
                    <h1 className="text-xl font-semibold mb-5">Total Number of Upvotes</h1>
                    <h1 className="text-5xl font-semibold">{numOfUpvotes}</h1>
                </div>
                <div className="bg-white p-3 rounded-[20px] text-center">
                    <h1 className="text-xl font-semibold mb-5">Total Number of Views</h1>
                    <h1 className="text-5xl font-semibold">{numOfViews}</h1>
                </div>
                <div className="bg-white p-3 rounded-[20px] text-center">
                    <h1 className="text-xl font-semibold mb-5">Total Number of Copies</h1>
                    <h1 className="text-5xl font-semibold">{numOfCopies}</h1>
                </div>  
            </div>
            <h1 className="mt-20 text-white text-3xl font-medium">Your Top 5 Snippets</h1>
            <p className="mt-3 text-white text-lg">Based on collective stats of upvotes, views, and copies</p>
        </div>
    )
}