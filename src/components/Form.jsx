import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "./Button";

import { validateDiscordToken } from "../util/validateDiscordToken";
import { constructURL } from "../util/constructURL";
import toast from "react-hot-toast";

function Form({ dispatch, state }) {
  const [authorizationToken, setAuthorizationToken] = useState(
    localStorage.getItem("authorizationToken") || ""
  );
  const [channelId, setChannelId] = useState(
    localStorage.getItem("channelId") || ""
  );

  async function verifyInfo(data) {
    dispatch({ type: "SET_LOADING", payload: true });
    const response = await fetch(constructURL(data.channelId), {
      headers: {
        Authorization: data.authorizationToken,
      },
      method: "POST",
    });
    if (response.status === 401) {
      dispatch({ type: "SET_LOADING", payload: false });
      toast.error("User doesn't exist!", { duration: 4000 });
      return;
    }
    if (response.status === 404) {
      dispatch({ type: "SET_LOADING", payload: false });
      toast.error("Invalid Channel ID!", { duration: 4000 });
      return;
    }
    toast.success("Authenticated");
    // toastComponent({ status: "Success", description: "Authenticated!" });
    dispatch({ type: "SET_LOADING", payload: false });
    dispatch({ type: "TRANSITION" });
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    dispatch({ type: "SET_AUTHORIZATION", payload: data.authorizationToken });
    dispatch({ type: "SET_CHANNEL_ID", payload: data.channelId });
    await verifyInfo(data);

    try {
      if (state.status !== "done") return;
      localStorage.setItem("authorizationToken", data.authorizationToken);
      localStorage.setItem("channelId", data.channelId);
    } catch (error) {
      console.error("Error storing data in localStorage:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xs">
      <div className="w-full max-w-xs">
        <div className="label">
          <span className="label-text">Authorization Token:</span>
        </div>
        <label className="input input-bordered flex items-center gap-2 w-full max-w-xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            className={`grow ${errors.authorizationToken ? "input-error" : ""}`}
            {...register("authorizationToken", {
              required: "Authorization token is required",
              validate: (value) =>
                validateDiscordToken(value) ||
                "Invalid Authorization token format",
            })}
            value={authorizationToken}
            onChange={(e) => setAuthorizationToken(e.target.value)}
          />
        </label>
        {errors.authorizationToken && (
          <p className="text-error">{errors.authorizationToken.message}</p>
        )}
      </div>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">
            Enter the Channel Id/DM/Group chat:
          </span>
        </div>
        <input
          type="text"
          placeholder=""
          className={`input input-bordered w-full max-w-xs ${
            errors.channelId ? "input-error" : ""
          }`}
          {...register("channelId", { required: "Channel ID is required" })}
          value={channelId}
          onChange={(e) => setChannelId(e.target.value)}
        />
        {errors.channelId && (
          <p className="text-error">{errors.channelId.message}</p>
        )}
      </label>
      {/* <Button
        type="neutral"
        onClick={handleSubmit(onSubmit)}
        classNames={"mt-8"}
        disabled={isLoading}
      >
        {isLoading && <span className="loading loading-spinner"></span>}
        Continue
      </Button> */}
      <button
        className="btn btn-neutral mt-8"
        onClick={handleSubmit(onSubmit)}
        disabled={state.isLoading}
      >
        {state.isLoading && <span className="loading loading-spinner"></span>}
        Continue
      </button>
    </form>
  );
}

export default Form;
