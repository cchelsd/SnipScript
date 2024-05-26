import { useState, useEffect } from "react";

export default function Analytics() {
  const [numOfViews, setNumOfViews] = useState(0);
  const [numOfCopies, setNumOfCopies] = useState(0);
  const [numOfUpvotes, setNumOfUpvotes] = useState(0);
  const [topSnippets, setTopSnippets] = useState([]);
  const [recentSnippets, setRecentSnippets] = useState([]);
  const user = localStorage.getItem("Current user id");

  const fetchTopSnippets = () => {
    if (user) {
      fetch(`http://localhost:3001/analytics/top?user_id=${user}`, {
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
          setTopSnippets(data);
          console.log("Top Snippets Data:", data);
        })
        .catch((error) => {
          console.error("Error fetching top snippets:", error);
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
          console.log("Recent Snippets Data:", data);
        })
        .catch((error) => {
          console.error("Error fetching recent snippets:", error);
        });
    }
  };

  useEffect(() => {
    fetchTopSnippets();
  }, []);

  return (
    <div className="flex flex-col items-center h-full">
      <h1 className="mt-12 mb-12 text-4xl font-semibold text-center text-white">
        YOUR SNIPPET ANALYTICS
      </h1>
      <div className="grid w-3/4 h-32 grid-cols-3 gap-10">
        <div className="bg-white p-3 rounded-[20px] text-center">
          <h1 className="mb-5 text-xl font-semibold">
            Total Number of Upvotes
          </h1>
          <h1 className="text-5xl font-semibold">{numOfUpvotes}</h1>
        </div>
        <div className="bg-white p-3 rounded-[20px] text-center">
          <h1 className="mb-5 text-xl font-semibold">Total Number of Views</h1>
          <h1 className="text-5xl font-semibold">{numOfViews}</h1>
        </div>
        <div className="bg-white p-3 rounded-[20px] text-center">
          <h1 className="mb-5 text-xl font-semibold">Total Number of Copies</h1>
          <h1 className="text-5xl font-semibold">{numOfCopies}</h1>
        </div>
      </div>
      <h1 className="mt-20 text-3xl font-medium text-white">Top 5 Snippets</h1>
      <p className="mt-3 text-lg text-white">
        Based on collective stats of upvotes, views, and copies
      </p>
      <ul className="flex flex-col items-center w-full mt-5 text-white">
        {topSnippets.length > 0 ? (
          topSnippets.map((snippet) => (
            <li
              key={snippet.id}
              className="w-3/4 p-5 mb-5 bg-gray-700 rounded-lg"
            >
              <h2 className="mb-2 text-2xl font-semibold">
                Title: {snippet.title || "Title not listed."}
              </h2>
              <p className="mb-2 text-lg">
                <span className="font-bold">Description: </span>
                {snippet.snippet_description || "Description not listed."}
              </p>
              <p className="mb-2 text-sm">
                <span className="font-bold">Language: </span>
                {snippet.code_language || "Language not listed."}
              </p>
              <p className="mb-2 text-sm">
                <span className="font-bold">Total Stats: </span>
                {snippet.Total_Stats || "Stats not available."}
              </p>
              <pre className="p-2 bg-gray-800 rounded">
                {snippet.code_content || "Code not listed."}
              </pre>
            </li>
          ))
        ) : (
          <li className="text-lg">No top snippets available</li>
        )}
      </ul>
    </div>
  );
}
