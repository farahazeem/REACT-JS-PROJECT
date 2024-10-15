import React, { useEffect, useState } from "react";
import classes from "./foodsAdminPage.module.css";
import { Link, useSearchParams } from "react-router-dom";
import { deleteById, getAll, search } from "../../services/foodService";
import NotFound from "../../components/NotFound/NotFound";
import Title from "../../components/Title/Title";
import Search from "../../components/Search/Search";
import Price from "../../components/Price/Price";
import { toast } from "react-toastify";
import { Dialog } from "primereact/dialog";
import StarRating from "../../components/StarRating/StarRating";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";

export default function FoodsAdminPage() {
  const [foods, setFoods] = useState([]);
  const { searchTerm } = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  useEffect(() => {
    loadFoods();
  }, [searchTerm]);

  const loadFoods = async () => {
    const foods = searchTerm ? await search(searchTerm) : await getAll();
    setFoods(foods);
  };

  const FoodsNotFound = () => {
    if (foods && foods.length > 0) return;

    return searchTerm ? (
      <NotFound linkRoute="/admin/foods" linkText="Show All" />
    ) : (
      <NotFound linkRoute="/dashboard" linkText="Back to dashboard" />
    );
  };

  const deleteFood = async (food) => {
    //I replaced it with shadCn alert dialog
    // const confirmed = window.confirm(`Delete Food ${food.name}?`);
    // if (!confirmed) return;

    await deleteById(food.id);
    toast.success("Food item has been deleted");

    setFoods(foods.filter((item) => item.id !== food.id));
  };

  const handleFoodView = async (food) => {
    setSelectedFood(food);
    setVisible(true);
  };

  return (
    <>
      <div className={classes.container}>
        <div className={classes.list}>
          <Title title="Manage Foods" margin="1rem auto" />
          <Search
            searchRoute="/admin/foods/"
            defaultRoute="/admin/foods"
            margin="1rem 0"
            placeholder="Search Foods"
          />
          <Link to="/admin/addFood" className={classes.add_food}>
            Add Food +
          </Link>
          <FoodsNotFound />
          {foods &&
            foods.map((food) => (
              <div key={food.id} className={classes.list_item}>
                <img src={food.imageUrl} alt={food.name} />
                <Link to={"/food/" + food.id}>{food.name}</Link>
                <Price price={food.price} />
                <div className={classes.actions}>
                  <Link onClick={() => handleFoodView(food)}>View</Link>
                  <Link to={"/admin/editFood/" + food.id}>Edit</Link>
                  {/* <Link onClick={() => deleteFood(food)}>Delete</Link> */}
                  <AlertDialog>
                    <AlertDialogTrigger style={{ color: "#0370b9" }}>
                      Delete
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to delete this item?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the item.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteFood(food)}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
        </div>
      </div>
      {selectedFood && (
        <Dialog
          header={selectedFood.name}
          visible={visible}
          style={{ width: "25vw" }}
          onHide={() => {
            if (!visible) return;
            setVisible(false);
          }}
        >
          <>
            <p>
              <b>Price:</b> {selectedFood.price}
            </p>
            <p>
              <b>Cook Time:</b> {selectedFood.cookTime}
            </p>
            <p className="flex">
              <b>Stars:</b> <StarRating stars={selectedFood.stars} size={25} />
            </p>
          </>
        </Dialog>
      )}
    </>
  );
}
