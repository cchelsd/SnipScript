import Design from "../images/homeDesign.png";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const isLoggedIn = localStorage.getItem("Current user id") ? true : false;
  const navigate = useNavigate();

  const handleNav = () => {
    isLoggedIn ? navigate("/dashboard") : navigate("/authentication");
  };

  return (
    <div className="flex flex-col items-center h-full overflow-y-auto">
      <div className="flex flex-row items-center mt-12 mb-10">
        <div className="w-1/2 pl-20">
          <h1 className="mb-4 text-6xl font-bold leading-tight text-white">
            Manage and discover code snippets in one shared space
          </h1>
          <p className="mb-8 font-semibold text-white">
            Say goodbye to scattered code snippets: SnipScript allows developers
            to easily organize their code snippets and discover new solutions,
            streamlining their workflow.
          </p>
          <button
            className="p-4 font-semibold text-white rounded-lg bg-violet-800 hover:bg-violet-900 backdrop:"
            onClick={handleNav}
          >
            Get started with SnipScript
          </button>
        </div>
        <div className="w-1/2 pl-32">
          <img className="w-10/12" src={Design}></img>
        </div>
      </div>
      <div className="p-20 text-white">
        <h1 className="mb-12 text-5xl font-bold text-center">
          What is SnipScript?
        </h1>
        <p className="mb-12 font-semibold text-center">
          SnipScript is the ultimate tool for developers to manage and explore
          code snippets. Designed with productivity in mind, SnipScript offers a
          pleasant experience for discovering and organizing code, ensuring that
          your development process is efficient and hassle-free.
        </p>
        <h1 className="mb-4 text-3xl font-bold text-center">Key Features</h1>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="mt-4 text-xl font-bold">
              1. Organized Boards and Lists
            </p>
            <p>
              <span className="font-semibold">• Customizable Boards: </span>
              Create and manage boards for different projects or categories,
              making it easy to keep your code organized.
            </p>
            <p>
              <span className="font-semibold">• Structured Lists: </span>
              Create customized lists for different categories of organization
              across code categories.
              <p>
                <span className="font-semibold">• Customizable Boards: </span>
                Create and manage boards for different projects or categories,
                making it easy to keep your code organized.
              </p>
            </p>
          </div>
          <div>
            <p className="mt-4 text-xl font-bold">
              2. Effortless Code Snippet Management
            </p>
            <p>
              <span className="font-semibold">• Detailed Snippet View: </span>
              Store information for each snippet, including title, description,
              tags, code content, and code language. Using a built-in code
              editor with IntelliSense, you can even type your code directly in
              our app.
            </p>
            <p>
              <span className="font-semibold">• Drag and Drop: </span>With a
              kanban-style interface, easily move snippets between lists with a
              simple drag-and-drop action.
            </p>
          </div>
          <div>
            <p className="mt-4 text-xl font-bold">3. Discover New Solutions</p>
            <p>
              <span className="font-semibold">• Explore Snippets: </span>Browse
              snippets shared by other developers to find new and innovative
              solutions.
            </p>
            <p>
              <span className="font-semibold">• Search Snippets: </span>Find
              exactly what you need by searching by code titles, tags, or
              descriptions.
            </p>
          </div>
          <div>
            <p className="mt-4 text-xl font-bold">4. Streamlined Workflow</p>
            <p>
              <span className="font-semibold">• Explore Snippets: </span>Keep
              all your code snippets in one place, ensuring you have the right
              code when you need it.
            </p>
            <p>
              <span className="font-semibold">• Enhanced Productivity: </span>
              Spend less time searching for code and more time developing.
            </p>
          </div>
        </div>
        <p className="mt-12 text-center">
          Developed by: <span className="font-bold">Chelsea Dacones | </span>
          chelsjd@uw.edu, <span className="font-bold">Aryan Damle | </span>
          adamle@uw.edu, and <span className="font-bold">Ares Zhang | </span>
          aresz@uw.edu
        </p>
      </div>
    </div>
  );
}
