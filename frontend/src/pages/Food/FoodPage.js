import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Price from "../../components/Price/Price";
import StarRating from "../../components/StarRating/StarRating";
import Tags from "../../components/Tags/Tags";
import { useCart } from "../../hooks/useCart";
import { getById } from "../../services/foodService";
import classes from "./foodPage.module.css";
import NotFound from "../../components/NotFound/NotFound";
import { useQuery } from "react-query";

export default function FoodPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const {
    isLoading,
    error,
    data: food,
  } = useQuery(["food", id], () => getById(id)); //useQuery() explained in details below

  //The first argument to useQuery is a query key.
  //This key uniquely identifies the query and helps React Query to manage and cache the results.
  //In this case, the key is an array consisting of the string "food" and the id. i.e. ["food", id]
  //By including the id in the key, you ensure that each food item is cached separately.

  //The second argument is a query function.
  //This is the function that React Query will call to fetch the data.
  //In this case, it's an anonymous arrow function that calls getById(id).
  //This function is expected to return a promise that resolves to the data you want to fetch.

  const handleAddToCart = () => {
    addToCart(food);
    navigate("/cart");
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>An error has occurred: {error.message}</p>;

  return (
    <>
      {!food ? (
        <NotFound message="Food Not Found!" linkText="Back To Homepage" />
      ) : (
        <div className={classes.container}>
          <img
            className={classes.image}
            src={`${food.imageUrl}`}
            alt={food.name}
          />

          <div className={classes.details}>
            <div className={classes.header}>
              <span className={classes.name}>{food.name}</span>
              <span
                className={`${classes.favorite} ${
                  food.favorite ? "" : classes.not
                }`}
              >
                ❤
              </span>
            </div>
            <div className={classes.rating}>
              <StarRating stars={food.stars} size={25} />
            </div>

            <div className={classes.origins}>
              {food.origins?.map((origin) => (
                <span key={origin}>{origin}</span>
              ))}
            </div>

            <div className={classes.tags}>
              {food.tags && (
                <Tags
                  tags={food.tags.map((tag) => ({ name: tag }))}
                  forFoodPage={true}
                />
              )}
            </div>

            <div className={classes.cook_time}>
              <span>
                Time to cook about <strong>{food.cookTime}</strong> minutes
              </span>
            </div>

            <div className={classes.price}>
              <Price price={food.price} />
            </div>

            <button onClick={handleAddToCart}>Add To Cart</button>
          </div>
        </div>
      )}
    </>
  );
}
