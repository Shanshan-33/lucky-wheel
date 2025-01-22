import React, { useState } from "react";
import { Button, Checkbox, Form, Input } from "antd";
import "./index.css";

const Participants = ({
  handleAddName,
  handleRemoveName,
  shuffleNames,
  sortNames,
  names,
}) => {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    const { participants } = values;
    form.resetFields();
    handleAddName(participants);
  };
  return (
    <div className="participants">
      <h2>Add Participants</h2>
      <Form
        form={form}
        name="basic"
        layout="inline"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label=""
          name="participants"
          rules={[
            {
              required: true,
              message: "Please input participants!",
            },
          ]}
        >
          <Input style={{ width: "280px" }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add
          </Button>
        </Form.Item>
      </Form>
      <div className="participants-list">
        <h2>Participants</h2>
        <div className="participant-items">
          {names.map((participant, index) => (
            <div key={index} className="participant-item">
              <div className="participant-name">{participant}</div>
              <Button type="primary" onClick={() => handleRemoveName(index)}>
                Del
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Participants;
