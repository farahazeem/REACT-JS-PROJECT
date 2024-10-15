import React, { useEffect } from "react";
import classes from "./userEditPage.module.css";
import { getById, updateUser } from "../../services/userService";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Input from "../../components/Input/Input";
import Title from "../../components/Title/Title";
import Button from "../../components/Button/Button";
import { EMAIL } from "../../constants/patterns";

export default function UserEditPage() {
  const { userId } = useParams();
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    getById(userId).then((user) => {
      reset(user);
    });
  }, [userId]);

  const submit = async (userData) => {
    await updateUser(userData);
  };

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <Title title="Edit User" />
        <form onSubmit={handleSubmit(submit)} noValidate>
          {/* handleSubmit will pass all the formData to the submit function above*/}
          <Input
            type="text"
            label="Name"
            {...register("name", {
              required: true,
              minLength: 5,
            })}
            error={errors.name}
          />

          <Input
            type="text"
            label="Email"
            {...register("email", {
              required: true,
              pattern: EMAIL,
            })}
            error={errors.email}
          />

          <Input
            type="text"
            label="Address"
            {...register("address", {
              required: true,
            })}
            error={errors.address}
          />
          <Input
            type="checkbox"
            label="Is Admin"
            {...register("isAdmin")}
            //won't show any errors since it doesnt have any validations
          />
          <Button type="submit" backgroundColor="#0370b9" />
        </form>
      </div>
    </div>
  );
}
