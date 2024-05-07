import { useRef, useReducer, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import Stats from "./components/Stats";
import Form from "./components/Form";
import { constructURL } from "./util/constructURL";
import Steps from "./components/Steps";
import { FormProvider } from "react-hook-form";

import Modal from "./components/Modal";

const initialState = {
  isStarted: false,
  isLoading: false,
  isError: false,
  pings: 0,
  duration: 0,
  channelId: "",
  curStep: 1,
  authorizationToken: "",
  status: "waiting",
  modalIsOpen: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "START_TYPING":
      return {
        ...state,
        isStarted: true,
        isLoading: false,
        isError: false,
        pings: 0,
        duration: 0,
      };
    case "STOP_TYPING":
      return {
        ...state,
        isStarted: false,
        isLoading: false,
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, isError: action.payload };
    case "SET_CHANNEL_ID":
      return { ...state, channelId: action.payload };
    case "SET_AUTHORIZATION":
      return { ...state, authorizationToken: action.payload };
    case "INCREMENT_PINGS":
      return { ...state, pings: state.pings + 1 };
    case "INCREMENT_DURATION":
      return { ...state, duration: state.duration + 1 };
    case "TRANSITION":
      return { ...state, status: "done", curStep: 2 };
    case "TOGGLE_MODAL":
      return { ...state, modalIsOpen: !state.modalIsOpen };
    default:
      throw new Error();
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const intervalRef = useRef(null);
  const stopWatchRef = useRef(null);

  const modalRef = useRef(null);

  useEffect(() => {
    // Clean up intervals when component unmounts
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(stopWatchRef.current);
    };
  }, []);

  async function startFakeTyping() {
    // Reset error and loading state
    dispatch({ type: "SET_ERROR", payload: false });
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await fetch(constructURL(state.channelId), {
        headers: {
          Authorization: state.authorizationToken,
        },
        method: "POST",
      });
      if (response.ok) {
        dispatch({ type: "SET_LOADING", payload: false });
        dispatch({ type: "START_TYPING" });
        toast.success("Fake typing started!");

        // Clear existing intervals before starting new ones
        clearInterval(intervalRef.current);
        clearInterval(stopWatchRef.current);

        stopWatchRef.current = setInterval(() => {
          dispatch({ type: "INCREMENT_DURATION" });
        }, 1000);

        intervalRef.current = setInterval(async () => {
          try {
            const request = await fetch(constructURL(state.channelId), {
              headers: {
                Authorization: state.authorizationToken,
              },
              method: "POST",
            });
            console.log("PINGED");
            dispatch({ type: "INCREMENT_PINGS" });
          } catch (err) {
            if (err.message === "Failed to fetch") {
              toast.error(
                "Network error! Make sure you're connected to the internet."
              );
            } else toast.error("Failed to start fake typing!");

            dispatch({ type: "STOP_TYPING" });
            clearInterval(intervalRef.current);
            clearInterval(stopWatchRef.current);
          }
        }, 3000);
      }
    } catch (error) {
      if (error.message === "Failed to fetch") {
        toast.error(
          "Network error! Make sure you're connected to the internet."
        );
      } else toast.error("Failed to start fake typing!");
      dispatch({ type: "SET_LOADING", payload: false });
      dispatch({ type: "SET_ERROR", payload: true });
      console.error("Error starting fake typing:", error);
    }
  }

  function stopFakeTyping() {
    dispatch({ type: "STOP_TYPING" });
    clearInterval(intervalRef.current);
    clearInterval(stopWatchRef.current);
    toast.success("Fake typing stopped!");
  }

  return (
    <div className="App">
      <Modal title={"IMPORTANT NOTE"}>
        <p>
          We <strong>DONT</strong> store <strong>ANY</strong> type of
          information inputted in the Web App. INCLUDING AUTHORIZATION TOKENS,
          NOT EVEN CHANNEL IDs.
        </p>
        <br />
        <p>
          For Proof:{" "}
          <a
            href="https://github.com/Ayanprogrammer11/fakeTyping"
            className="link link-info"
          >
            Github Repo
          </a>
        </p>
        <br />
        <p>
          If you still don't trust us, We Encourage you to use Developer Tools
          :)
        </p>
      </Modal>
      <Toaster
        toastOptions={{
          style: {
            background: "#363636",
            color: "#fff",
          },
          duration: 4000,
        }}
      />
      <div className="upper-container text-center">
        <h1 className="text-3xl font-bold text-center m-10">
          Fake Typing for Discord
        </h1>
        <Steps curStep={state.curStep} />
      </div>
      <div className="main-container flex justify-center items-center flex-col gap-12 mt-24">
        {state.status === "done" && (
          <>
            <div className="flex gap-5 justify-center items-center">
              <button
                className="btn btn-error"
                onClick={startFakeTyping}
                disabled={state.isStarted || state.isLoading}
              >
                {state.isLoading && (
                  <span className="loading loading-spinner"></span>
                )}
                Start Fake Typing
              </button>
              <button
                className="btn btn-info"
                disabled={!state.isStarted || state.isLoading}
                onClick={stopFakeTyping}
              >
                Stop Fake Typing
              </button>
            </div>
            <Stats stats={{ pings: state.pings, duration: state.duration }} />
          </>
        )}
        {state.status === "waiting" && (
          <>
            <FormProvider>
              <Form dispatch={dispatch} state={state} />
            </FormProvider>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
