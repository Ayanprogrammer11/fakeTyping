import { useState } from "react";

function Modal({ title, children }) {
  const [isShaking, setIsShaking] = useState(false);

  const [isClicked, setIsClicked] = useState(false);

  return (
    <>
      <div className="absolute right-0 top-0 m-4">
        <button
          className={`btn btn-circle ${
            !isClicked ? "animate-jump animate-infinite" : ""
          }`}
          onClick={() => {
            document.getElementById("my_modal_5").showModal();
            setIsClicked(true);
            setIsShaking(false);
          }}
        >
          <svg
            className="swap-off fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512"
          >
            <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
          </svg>
        </button>
      </div>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="py-4">{children}</p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default Modal;
