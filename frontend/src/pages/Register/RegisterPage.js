import React, { useEffect, useRef } from "react";
import classes from "./registerPage.module.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import Title from "../../components/Title/Title";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { EMAIL } from "../../constants/patterns";
import ReCAPTCHA from "react-google-recaptcha";
const GOOGLE_RECAPTCHA_SITE_KEY = "6LcOnRIqAAAAAJzZ8onKXdRnI25QZknk4w52hr7w";

export default function RegisterPage() {
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { user } = useAuth();
  // const [params] = useSearchParams();
  // console.log(params);
  // const returnUrl = params.get("returnUrl") || "";
  const returnUrl = "/";
  const auth = useAuth();
  const captchaRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    returnUrl ? navigate(returnUrl) : navigate("/");
  }, [user]);

  const submit = async (data) => {
    const token = captchaRef.current.getValue();
    await auth.register({ ...data, token });
    captchaRef.current.reset();
  };

  return (
    <div className={classes.container}>
      <div className={classes.details}>
        <Title title="Register" />
        <form aria-label="form" onSubmit={handleSubmit(submit)} noValidate>
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
            type="email"
            label="Email"
            {...register("email", {
              required: true,
              pattern: EMAIL,
            })}
            error={errors.email}
          />
          <Input
            type="password"
            label="Password"
            {...register("password", {
              required: true,
              minLength: 5,
            })}
            error={errors.password}
          />
          <Input
            type="password"
            label="Confirm Password"
            {...register("confirmPassword", {
              required: true,
              validate: (value) =>
                value !== getValues("password")
                  ? "Password Do Not Match"
                  : true,
            })}
            error={errors.confirmPassword}
          />
          <Input
            type="address"
            label="Address"
            {...register("address", {
              required: true,
              minLength: 10,
            })}
            error={errors.address}
          />
          <div className={classes.login}>
            <ReCAPTCHA
              data-testid="recaptcha"
              sitekey={GOOGLE_RECAPTCHA_SITE_KEY}
              ref={captchaRef}
            />
          </div>
          <Button type="submit" text="Register" />
          <div className={classes.login}>
            Already a user? &nbsp;
            <Link to={`/login${returnUrl ? "?returnUrl=" + returnUrl : ""}`}>
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
