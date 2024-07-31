import React, { useEffect } from "react";
import {
  Button,
  Form,
  Modal,
  Select,
  Table,
  Input,
  message,
  Row,
  Col,
} from "antd";
import "../resources/authentication.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate;
  const onFinish = (values) => {
    dispatch({ type: "showLoading" });
    axios
      .post("/api/users/register", values)
      .then((res) => {
        dispatch({ type: "hideLoading" });
        message.success(
          "Registration successful, please wait for verification"
        );
      })
      .catch(() => {
        dispatch({ type: "hideLoading" });
        message.error("Something went wrong");
      });
  };
  useEffect(() => {
    if (localStorage.getItem("pos-user")) navigate("/home");
  }, []);

  return (
    <div className="authentication">
      <Row>
        <Col lg={8} xs={22}>
          <Form layout="vertical" onFinish={onFinish}>
            <h1>
              <b>INVENTRADE</b>
            </h1>
            <hr />
            <h3>Register</h3>
            <Form.Item name="name" label="Name">
              <Input />
            </Form.Item>
            <Form.Item name="userId" label="User ID">
              <Input />
            </Form.Item>
            <Form.Item name="password" label="Password">
              <Input type="password" />
            </Form.Item>

            <div className="d-flex justify-content-between align-items-center">
              <Link to="/login">Already Registered? Click Here To Login</Link>
              <Button htmlType="submit" type="primary">
                REGISTER
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default Register;
