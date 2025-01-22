import React, { useEffect, useRef, useState } from "react";
import { Button, Input } from "antd";
import { FormOutlined } from "@ant-design/icons";
import "./index.css";
const Question = () => {
  const inputRef = useRef();
  const [question, setQuestion] = useState("What is your question?");
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      // 自动获取焦点
      inputRef.current.focus({
        cursor: "start",
      });
    }
  }, [editable]);

  const handleClick = () => {
    setEditable(true);
  };

  const handleBlur = () => {
    setEditable(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "Escape") {
      setEditable(false);
    }
  };

  return (
    <div className="question" onClick={handleClick}>
      {editable ? (
        <Input
          className="question-input"
          ref={inputRef}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <div className="question-container">
          <div className="question-text">{question}</div>
          <Button
            className="question-edit-btn"
            icon={<FormOutlined />}
            onClick={handleClick}
          ></Button>
        </div>
      )}
    </div>
  );
};

export default Question;
