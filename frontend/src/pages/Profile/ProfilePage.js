import React from "react";
import classes from "./profilePage.module.css";
import { useForm } from "react-hook-form";
import Input from "../../components/Input/Input";
import Title from "../../components/Title/Title";
import Button from "../../components/Button/Button";
import { useAuth } from "../../hooks/useAuth";
import ChangePassword from "../../components/ChangePassword/ChangePassword";

export default function ProfilePage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const { user, updateProfile } = useAuth();

  const submit = (data) => {
    console.log({ data });
    updateProfile(data);
  };

  return (
    <>
      <div className={classes.container}>
        <div className={classes.details}>
          <Title title="Update Profile" fontSize="1.6rem" />
          <form onSubmit={handleSubmit(submit)}>
            <Input
              defaultValue={user.name}
              type="text"
              label="Name"
              {...register("name", {
                required: true,
                minLength: 5,
              })}
              error={errors.name}
            />
            <Input
              defaultValue={user.address}
              type="text"
              label="Address"
              {...register("address", {
                required: true,
                minLength: 10,
              })}
              error={errors.address}
            />
            <Button type="submit" text="Update" backgroundColor="green" />
          </form>
          <ChangePassword />
        </div>
      </div>
    </>
  );
}
