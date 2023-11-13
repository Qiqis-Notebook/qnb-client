import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault(); // Prevents the form from submitting the traditional way
    navigate(`/routes/search?q=${encodeURI(query)}`);
  };
  return (
    <div className="flex flex-col gap-2 grow p-2">
      <div className="flex items-center">
        <form className="w-full" onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
}
