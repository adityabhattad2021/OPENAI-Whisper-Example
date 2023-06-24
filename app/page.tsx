"use client";
import { useEffect, useReducer, useRef } from "react";

type State = {
  file: File | null;
  isLoading: boolean;
  response: string;
};

type Action = {
  type: string;
  payload: any;
};

const ACTION = {
  SET_FILE: "setFile",
  SET_IS_LOADING: "setIsLoading",
  SET_RESPONSE: "setResponse"
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'setFile': {
      return { ...state, file: action.payload }
    }
    case 'setIsLoading': {
      return { ...state, isLoading: action.payload }
    }
    case 'setResponse': {
      return { ...state, response: action.payload }
    }
    default: {
      throw new Error("Undefined State")
    }
  }
}

export default function Home() {

  const [state, dispatch] = useReducer(reducer, {
    file: null,
    isLoading: false,
    response: ""
  })

  const fileInputRef = useRef(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.currentTarget.files?.[0];
    if (!file) {
      return;
    }
    dispatch({
      type: ACTION.SET_FILE,
      payload: file
    })
  }

  async function callGetTranscription() {
    dispatch({
      type: ACTION.SET_IS_LOADING,
      payload: true
    })
    if (!state.file) {
      dispatch({
        type: ACTION.SET_IS_LOADING,
        payload: false
      })
      return;
    }
    const formData = new FormData();
    formData.set("file", state.file);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData
      });
      if (response.ok) {
        alert("File Uploaded Successfully");
      } else {
        alert("Failed to upload the file");
        return;
      }
      const data = await response.json()
      dispatch({
        type: ACTION.SET_RESPONSE,
        payload: data.output.text
      })
    } catch (error) {
      alert(`Error generated from the server: ${error}`)
      dispatch({
        type: ACTION.SET_FILE,
        payload: null
      })
      dispatch({
        type: ACTION.SET_IS_LOADING,
        payload: false
      })
    }
  }



  return (
    <main
      className="
        flex
        min-h-screen
        flex-col
        items-center
        justify-between
        px-24
        py-5
      "
    >
      <h1
        className="
          md:text-5xl
          text-3xl
          font-sans
        "
      >
        Whisperer
      </h1>
      <div
        className="
          flex
          h-[35rem]
          md:min-w-[50rem]
          min-w-[18rem]
          flex-col
          items-center
          bg-gray-600
          rounded-xl
        "
      >
        <div className="
          h-full
          flex
          flex-col
          gap-2 
          overflow-y-auto
          py-8
          px-3
          w-full
        "
        >
          <div
            className="
              w-full
              rounded-lg
              p-2
              mt-[-20px]
              text-center
              bg-blue-500
            "
          >
            <input
              type="file"
              id="fileInput"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".wav, .mp3"
              style={{ display: "none" }}
            />
            <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
              Click to select a file
            </label>
          </div>
          <div className="
            w-full
            rounded-xl
            p-5
            h-max
            border-2
            break-words
          ">
            {!state.isLoading ? 'Loading' : state?.response}
          </div>
        </div>
          <div
            className="
              relative
              w-full
              bottom-4
              flex
              justify-center
            "
          >
              <button
                onClick={callGetTranscription}
                className="
                  w-full
                  bg-blue-500
                  px-4
                  py-2
                  mx-3
                  rounded-md
                " 
              >
                Upload
              </button>
          </div>
      </div>
    </main>
  )
}
