import { useState, useEffect } from "react";
import SnippetCard from "../components/snippet_card";

export default function Explore() {
  const [snippets, setSnippets] = useState([]);
  const [allSnippets, setAllSnippets] = useState([]); // Store all snippets for filtering
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchSnippets = () => {
    fetch(`http://localhost:3001/explore`, {
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
        setSnippets(data);
        setAllSnippets(data); // Store all snippets for filtering
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const fetchTags = () => {
    fetch(`http://localhost:3001/explore/popular-tags`, {
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
        setTags(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    if (tag === "all") {
      setSnippets(allSnippets); // Show all snippets if no tag is selected
    } else {
      const filteredSnippets = allSnippets.filter((snippet) =>
        snippet.tags.includes(tag)
      );
      setSnippets(filteredSnippets);
    }
  };

  const handleSearch = (query) => {
    console.log(query);
    fetch(`http://localhost:3001/explore/search/${query}`, {
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
        setSnippets(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const fetchTrendingSnippets = () => {
    setSelectedTag("trending")
    fetch(`http://localhost:3001/explore/trending`, {
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
        setSnippets(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  useEffect(() => {
    fetchSnippets();
    fetchTags();
  }, []);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    if (event.target.value === "") {
      setSnippets(allSnippets); // Reset to all snippets if search query is empty
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    handleSearch(searchQuery);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <h1 className="mt-12 mb-12 text-4xl font-semibold text-center text-white">
        EXPLORE
      </h1>
      <form onSubmit={handleSearchSubmit} className="flex justify-center mb-4">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search snippets"
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="w-1/2 place-self-center rounded-3xl h-11 border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-md sm:leading-6"
        />
        <button
          type="submit"
          className="px-4 py-2 ml-4 bg-violet-200 text-violet-800 rounded-full hover:bg-violet-800 hover:text-white"
        >
          Search
        </button>
      </form>
      <div className="flex flex-wrap justify-center mt-4">
        <button
          className={`m-2 px-4 py-1 rounded-full hover:bg-violet-800 hover:text-white ${
            selectedTag === "all"
              ? "bg-violet-800 text-white border border-2 border-violet-200"
              : "bg-violet-200 text-violet-800"
          }`}
          onClick={() => handleTagClick("all")}
        >
          All
        </button>
        {tags.map((tag) => (
          <button
            key={tag.tag}
            className={`m-2 px-4 py-1 rounded-full hover:bg-violet-800 hover:text-white ${
              selectedTag === tag.tag
                ? "bg-violet-800 text-white border border-2 border-violet-200"
                : "bg-violet-200 text-violet-800"
            }`}
            onClick={() => handleTagClick(tag.tag)}
          >
            {tag.tag}
          </button>
        ))}
        <button className={`m-2 ml-12 px-4 py-1 rounded-full hover:bg-violet-800 hover:text-white ${
            selectedTag === "trending"
              ? "bg-violet-800 text-white border border-2 border-violet-200"
              : "bg-violet-200 text-violet-800"
          }`}
          onClick={() => fetchTrendingSnippets()}>Trending Snippets</button>
      </div>
      <div className="flex items-center justify-center w-full overflow-auto bg-transparent">
        <div className="grid grid-cols-1 gap-5 p-4 mx-12 mt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 md:p-2 xl:p-5">
          {snippets.map((snippet) => (
            <SnippetCard key={snippet.id} snippet={snippet} isUsers={false} />
          ))}
        </div>
      </div>
    </div>
)};