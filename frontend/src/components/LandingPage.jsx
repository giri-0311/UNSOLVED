import React, { useState, useEffect } from "react";
import "./LandingPage.css";
import leetcodeImage from "./leetcode.png";
import { ToastContainer, toast } from 'react-toastify';
import codeforcesImage from "./codeforces.png";
import { useAuth } from "../context/AuthContext.jsx";
import { Navigate } from "react-router-dom";

export default function LandingPage() {
  const {userToken,setUserToken} = useAuth();
  const [type, setType] = useState("codeforces");
  const [question, setQuestion] = useState("");
  const [link, setLink] = useState("");
  const [problems, setProblems] = useState([]);

  async function addQuestion() {
    try {
      const response = await fetch("https://unsolved-vnfg.vercel.app/addQuestion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + userToken,
        },
        body: JSON.stringify({
          type: type,
          question: question,
          link: link,
        }),
      });
      const result = await response.json();
      if(result.message==="Question created successfully"){
        toast.success(result.message);
        getQuestions();
        setType("codeforces");
        setQuestion("");
        setLink("");
      }
      else{
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error);
    }
  }

  async function getQuestions() {
    try {
      const response = await fetch("https://unsolved-vnfg.vercel.app/getQuestions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const result = await response.json();
      setProblems(result.questions);
    } catch (error) {
      toast.error(error);
    }
  }

  async function getQuestionswithFilter(filter) {
    try {
      const response = await fetch("https://unsolved-vnfg.vercel.app/getQuestions/"+filter, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const result = await response.json();
      setProblems(result.questions);
    } catch (error) {
      toast.error(error);
    }
  }

  if(!userToken){
    return <Navigate to="/signup" replace={true} />
  }

  useEffect(() => {
    getQuestions();
  }, []);

  const openNewTab = (url) => {
    window.open(url, "_blank");
  };

  async function markAsDone(id) {
    try {
      const response = await fetch(
        `https://unsolved-vnfg.vercel.app/deleteQuestion/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + userToken,
          },
        }
      );
      const result = await response.json();
      getQuestions();
      toast.success("congo on solving this problem ")
    } catch (error) {
      console.log("Error:", error);
    }
  }

  return (
    <div className="home">
      <div className="form">
        <div className="askforform roboto-mono">
          Couldn't solve the problem. Don't worry
          <br />
          TRY AGAIN LATER
        </div>
        <div className="formelements roboto-mono">
          <div className="item">
            <label htmlFor="platforms">Choose a platform:</label>
            <select
              className="p-5"
              id="platforms"
              name="platforms"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
              }}
            >
              <option value="codeforces">Codeforces</option>
              <option value="leetcode">Leetcode</option>
              <option value="atcoder">AtCoder</option>
              <option value="wishlist">WishList</option>
            </select>
          </div>
          <div className="item">
            <label htmlFor="questionName">Question Name: </label>
            <input
              className="p-5"
              id="questionName"
              type="text"
              placeholder="Question Name"
              onChange={(e) => {
                setQuestion(e.target.value);
              }}
            />
          </div>
          <div className="item">
            <label htmlFor="URL">URL: </label>
            <input
              className="p-5"
              id="URL"
              type="url"
              placeholder="Paste the URL"
              onChange={(e) => {
                setLink(e.target.value);
              }}
            />
          </div>
          <button onClick={addQuestion}>Submit</button>
        </div>
      </div>
      <div className="filters">
        <button onClick={()=>{getQuestionswithFilter("leetcode")}}>Leetcode</button>
        <button onClick={()=>{getQuestionswithFilter("atcoder")}}>AtCoder</button>
        <button onClick={()=>{getQuestionswithFilter("codeforces")}}>Codeforces</button>
        <button onClick={()=>{getQuestionswithFilter("wishlist")}}>WishList</button>
      </div>
      <div className="problemslist">
        {problems.length > 0 ? (
          problems.map((problem, index) => (
            <div className="problem" key={index}>
              {problem.type === "leetcode" && (
                <img src={leetcodeImage} alt="leetcode" />
              )}
              {problem.type === "codeforces" && (
                <img src={codeforcesImage} alt="codeforces" />
              )}
              {problem.type === "atcoder" && (
                <img src="https://i.namu.wiki/i/oloBJdRd29lBIF-mdv1FjWucpE3tGPhudDBTvOBChAT3A5w9zDUYg51mvn6NNOwoHJZIwxkVyzeXQMhtLAcQOQ.webp" alt="atcoder" />
              )}
              {problem.type === "wishlist" && (
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0MGlM1Cq9J4MyGHOBen8BUc0nUsW_aiDoeQ&s" alt="atcoder" />
              )}
              <div className="questionname">{problem.question}</div>
              <div className="button">
                <button onClick={() => openNewTab(problem.link)}>View</button>
                <button
                  onClick={() => {
                    markAsDone(problem._id);
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="askforform roboto-mono">No problems available.</div>
        )}
      </div>
    </div>
  );
}
