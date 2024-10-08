import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Price from "../../components/Price/Price";
import StarRating from "../../components/StarRating/StarRating";
import Tags from "../../components/Tags/Tags";
import { useCart } from "../../hooks/useCart";
import { getById } from "../../services/foodService";
import NotFound from "../../components/NotFound/NotFound";
import { useQuery } from "react-query";
import { styled } from "styled-components";

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

  //Styles using Styled Components
  const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    margin: 3rem;

    & > * {
      min-width: 25rem;
      max-width: 40rem;
    }
  `;

  const Image = styled.img`
    border-radius: 3rem;
    flex: 1 0;
    object-fit: cover;
    height: 35rem;
    margin: 1rem;
  `;

  const Details = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    flex: 1 0;
    border-radius: 3rem;
    padding: 2rem;
    color: black;
    margin-left: 1rem;
  `;

  const Header = styled.div`
    display: flex;
    justify-content: space-between;
  `;

  const Name = styled.span`
    font-size: 2rem;
    font-weight: bold;
  `;

  const Favourite = styled.span`
    color: var(--primary-red);
    font-size: 2.5rem;

    &.not {
      color: grey;
    }
  `;

  const Origins = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 0.7rem 0;

    span {
      padding: 0.5rem;
      font-size: 1.2rem;
      margin: 0.5rem 0.5rem 0 0;
      border-radius: 2rem;
      background-color: aliceblue;
    }
  `;

  const Rating = styled.div`
    margin-top: 1rem;
  `;

  //can't name it Tags because it's already a component
  const TagsContainer = styled.div`
    margin: 1rem 0;
  `;

  const CookTime = styled.div`
    margin-top: 1rem;

    span {
      padding: 0.6rem 2rem 0.6rem 0;
      border-radius: 10rem;
      font-size: 1.3rem;
    }
  `;

  //can't name it Price because it's already a component
  const PriceContainer = styled.div`
    font-size: 1.8rem;
    margin: 2rem 2rem 2rem 0;
    color: green;

    &:before {
      content: "Price: ";
      color: darkgrey;
    }
  `;

  const Button = styled.button`
    color: white;
    background-color: var(--primary-red);
    border: none;
    font-size: 1.2rem;
    padding: 1rem;
    border-radius: 10rem;
    outline: none;

    &:hover {
      opacity: 0.9;
      cursor: pointer;
    }
  `;

  return (
    <>
      {!food ? (
        <NotFound message="Food Not Found!" linkText="Back To Homepage" />
      ) : (
        <Container>
          <Image src={`${food.imageUrl}`} alt={food.name} />

          <Details>
            <Header>
              <Name>{food.name}</Name>
              <Favourite className={food.favorite ? "" : "not"}>❤</Favourite>
            </Header>
            <Rating>
              <StarRating stars={food.stars} size={25} />
            </Rating>

            <Origins>
              {food.origins?.map((origin) => (
                <span key={origin}>{origin}</span>
              ))}
            </Origins>

            <TagsContainer>
              {food.tags && (
                <Tags
                  tags={food.tags.map((tag) => ({ name: tag }))}
                  forFoodPage={true}
                />
              )}
            </TagsContainer>

            <CookTime>
              <span>
                Time to cook about <strong>{food.cookTime}</strong> minutes
              </span>
            </CookTime>

            <PriceContainer>
              <Price price={food.price} />
            </PriceContainer>

            <Button onClick={handleAddToCart}>Add To Cart</Button>
          </Details>
        </Container>
      )}
    </>
  );
}
