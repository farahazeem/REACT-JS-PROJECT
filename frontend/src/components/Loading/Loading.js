import React from "react";
import classes from "./loading.module.css";
import { useLoading } from "../../hooks/useLoading";

export default function Loading() {
  const { isLoading } = useLoading();
  if (!isLoading) return;

  return (
    <div className={classes.container}>
      <div className={classes.items}>
        <img src="/loading.svg" alt="Loading!" />
        <h1>loading...</h1>
      </div>
    </div>
  );
}
