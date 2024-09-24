import React from "react";
import { Link } from "react-router-dom";
import classes from "./tags.module.css";

export default function Tags({ tags = [], forFoodPage }) {
  return (
    <div
      className={classes.container}
      data-testid="tags-component"
      style={{
        justifyContent: forFoodPage ? "start" : "center",
      }}
    >
      {tags.map((tag) => (
        <Link key={tag.name} to={`/tag/${tag.name}`} data-testid="tag-link">
          {tag.name}
          {!forFoodPage && `(${tag.count})`}
        </Link>
      ))}
    </div>
  );
}
