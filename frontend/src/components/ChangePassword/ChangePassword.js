import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import Title from "../Title/Title";
import Input from "../Input/Input";
import Button from "../Button/Button";

export default function ChangePassword() {
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();
  const { changePassword } = useAuth();

  const submit = (passwords) => {
    console.log({ passwords });
    changePassword(passwords);
  };

  return (
    <>
      <div>
        <Title title="Change Pasword" fontSize="1.6rem" />
        <form onSubmit={handleSubmit(submit)}>
          <Input
            type="password"
            label="Current Password"
            placeholder="Current Password"
            {...register("currentPassword", {
              required: true,
            })}
            error={errors.currentPassword}
          />
          <Input
            type="password"
            label="New Password"
            placeholder="New Password"
            {...register("newPassword", {
              required: true,
              minLength: 5,
            })}
            error={errors.newPassword}
          />
          <Input
            type="password"
            label="Confirm Password"
            placeholder="Confirm Password"
            {...register("confirmPassword", {
              required: true,
              validate: (value) =>
                value !== getValues("newPassword")
                  ? "Passwords do not match"
                  : true,
            })}
            error={errors.confirmPassword}
          />
          <Button type="submit" text="Change" />
        </form>
      </div>
    </>
  );
}
