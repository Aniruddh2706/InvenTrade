import { Button, Modal, Table, Form, Input, Select, message } from "antd";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const { cartItems } = useSelector((state) => state.rootReducer);
  const [billChargeModal, setBillChargeModal] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const increaseQuantity = (record) => {
    dispatch({
      type: "updateCart",
      payload: { ...record, quantity: record.quantity + 1 },
    });
  };

  const decreaseQuantity = (record) => {
    if (record.quantity !== 1) {
      dispatch({
        type: "updateCart",
        payload: { ...record, quantity: record.quantity + -1 },
      });
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (image, record) => (
        <img src={image} alt="" height="60" width="60" />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Quantity",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <PlusCircleOutlined
            className="mx-3"
            onClick={() => increaseQuantity(record)}
          />
          <b>{record.quantity}</b>
          <MinusCircleOutlined
            className="mx-3"
            onClick={() => decreaseQuantity(record)}
          />
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <DeleteOutlined
          onClick={() => dispatch({ type: "deleteFromCart", payload: record })}
        />
      ),
    },
  ];

  useEffect(() => {
    let temp = 0;
    cartItems.forEach((item) => {
      temp = temp + item.price * item.quantity;
    });

    setSubTotal(temp);
  }, [cartItems]);

  const onFinish = (values) => {
    const reqObject = {
      ...values,
      subTotal,
      cartItems,
      tax: ((subTotal / 100) * 10).toFixed(2),
      totalAmount: (subTotal + (subTotal / 100) * 10).toFixed(2),
      userId: JSON.parse(localStorage.getItem("pos-user"))._id,
    };

    axios
      .post("./api/bills/charge-bill", reqObject)
      .then(() => {
        message.success("Bill charged successfully");
        navigate("/bills");
      })
      .catch(() => {
        message.error("Something went wrong");
      });
  };

  return (
    <DefaultLayout>
      <h3>Cart</h3>
      <Table columns={columns} dataSource={cartItems} bordered />
      <hr />
      <div className="d-flex justify-content-end flex-column align-items-end">
        <div className="subtotal">
          <h3>
            SUB TOTAL : <b>{subTotal} /-</b>
          </h3>
        </div>
        <Button type="primary" onClick={() => setBillChargeModal(true)}>
          CHARGE BILL
        </Button>
      </div>

      <Modal
        title="Charge Bill"
        visible={billChargeModal}
        footer={false}
        onCancel={() => setBillChargeModal(false)}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="customerName" label="Customer Name">
            <Input required="true" />
          </Form.Item>
          <Form.Item name="customerPhoneNumber" label="Phone Number">
            <Input required="true" />
          </Form.Item>

          <Form.Item name="paymentMethod" label="Payment Method">
            <Select required="true">
              <Select.Option value="cash">Cash</Select.Option>
              <Select.Option value="card">Debit/Credit Card</Select.Option>
            </Select>
          </Form.Item>
          <div className="charge-bill-amount">
            <h5>
              SubTotal : <b>{subTotal}</b>
            </h5>
            <h5>
              Tax : <b>{((subTotal / 100) * 10).toFixed(2)}</b>
            </h5>
            <hr />
            <h2>
              Total : <b>{(subTotal + (subTotal / 100) * 10).toFixed(2)} /-</b>
            </h2>
          </div>

          <div className="d-flex justify-content-end">
            <Button htmlType="submit" type="primary">
              GENERATE BILL
            </Button>
          </div>
        </Form>
      </Modal>
    </DefaultLayout>
  );
}

export default CartPage;
