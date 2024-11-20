import React, { useEffect, useState } from "react";
import classes from "./search.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { getAll } from "../../services/foodService";

export default function Search({
  searchRoute = "/search/",
  defaultRoute = "/",
  margin,
  placeholder = "Search Scrumptious..",
}) {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();
  const { searchTerm } = useParams;
  const [foods, setFoods] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    loadFoods();
    setTerm(searchTerm ?? "");
  }, [searchTerm]);

  const search = async () => {
    term ? navigate(searchRoute + term) : navigate(defaultRoute);
  };

  const loadFoods = async () => {
    const data = await getAll();
    setFoods(data);
  };

  const onTextChange = (e) => {
    setTerm(e.target.value);

    const value = e.target.value;
    let filteredSuggestions = [];
    if (value.length > 0) {
      const regex = new RegExp(value, "i");
      filteredSuggestions = foods.filter((v) => regex.test(v.name));
    }
    setSuggestions(filteredSuggestions);
  };

  const suggestionSelected = (value) => {
    setTerm(value.name);
    setSuggestions([]);
  };

  const renderSuggestions = () => {
    if (suggestions.length === 0) {
      return null;
    }
    return (
      <div className={classes.TypeAheadDropDown}>
        <ul className={suggestions.length > 0 ? classes.visible : ""}>
          {suggestions.map((item) => (
            <li key={item.id} onClick={() => suggestionSelected(item)}>
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="">
      <div className={classes.container}>
        <input
          type="text"
          placeholder={placeholder}
          onChange={onTextChange}
          onKeyUp={(e) => e.key === "Enter" && search()}
          value={term}
        />
        <button onClick={search}>Search</button>
      </div>
      {renderSuggestions()}
    </div>
  );
}
