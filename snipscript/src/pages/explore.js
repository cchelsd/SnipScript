import { useState, useEffect } from "react";
import SnippetCard from "../components/snippet_card";

export default function Explore() {
    const [snippets, setSnippets] = useState([]);

    const fetchSnippets = () => {
        fetch(`http://localhost:3001/explore`, {
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
                setSnippets(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    useEffect(() => {
        fetchSnippets();
    }, []);

    
return (
    <div className="flex flex-col h-full">
        <h1 className="text-4xl text-center text-white font-semibold mt-12 mb-12">EXPLORE</h1>
        <input type="text" name="search" id="search" placeholder="Search snippets" className="w-1/2 place-self-center rounded-3xl h-11 border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-md sm:leading-6" />
        <div className="flex w-full justify-center items-center bg-transparent overflow-auto">
            <div className="mt-12 mx-12 grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 p-4 md:p-2 xl:p-5">
                {snippets.map(snippet => (
                    <SnippetCard key={snippet.id} snippet={snippet} />
                ))}
            </div>
        </div>
    </div>
)};