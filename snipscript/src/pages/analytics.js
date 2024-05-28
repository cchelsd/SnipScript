import { useState, useEffect } from "react";
import SnippetCard from "../components/snippet_card";

export default function Analytics() {
  const [numOfViews, setNumOfViews] = useState(0);
  const [numOfCopies, setNumOfCopies] = useState(0);
  const [numOfUpvotes, setNumOfUpvotes] = useState(0);
  const [topSnippets, setTopSnippets] = useState([]);
  const user = localStorage.getItem("Current user id");

  const fetchTopSnippets = () => {
    if (user) {
      fetch(`http://localhost:3001/analytics/top/${user}`, {
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
        })
        .catch((error) => {
          console.error("Error fetching top snippets:", error);
        });
    }
  };

  const fetchStats = () => {
    if (user) {
      fetch(`http://localhost:3001/analytics/user/${user}`, {
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
          setNumOfViews(data[0].numOfViews);
          setNumOfCopies(data[0].numOfCopies);
          setNumOfUpvotes(data[0].numOfUpvotes);
        })
        .catch((error) => {
          console.error("Error fetching top snippets:", error);
        });
    }
  };

  useEffect(() => {
    fetchStats();
    fetchTopSnippets();
  }, [user]);

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
        Based on collective stats of upvotes, views, copies, and bookmarks
      </p>
      <div className="flex items-center justify-center w-full overflow-auto bg-transparent">
        {topSnippets.length > 0 ? (
          <div className="grid w-5/6 grid-cols-1 gap-5 p-4 mx-12 mt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 md:p-2 xl:p-5">
          {topSnippets.map((snippet) => (
            <SnippetCard key={snippet.id} snippet={snippet} isUsers={true} />
          ))}
          </div>
        ) : (
          <p className="mt-5 text-lg text-white">No top snippets available. Make your snippets discoverable to others by setting them to public.</p>
        )}
      </div>
    </div>
  );
}
