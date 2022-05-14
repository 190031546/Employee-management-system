import React, { useState, useEffect } from "react";

/* REACT ROUTER */
import { Link } from "react-router-dom";

/* REACT BOOTSTRAP */
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";

/* PAYPAL BUTTONS */
import { PayPalButton } from "react-paypal-button-v2";

/* COMPONENTS */
import Message from "../components/Message";
import Loader from "../components/Loader";

/* REACT - REDUX */
import { useDispatch, useSelector } from "react-redux";

/* ACTION CREATORS */
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../actions/orderActions";

/* ACTION TYPES */
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../constants/orderConstants";

function OrderScreen({ history, match }) {
  const orderId = match.params.id;

  const dispatch = useDispatch();

  const [sdkReady, setSdkReady] = useState(false);

  /* PULLING A PART OF STATE FROM THE ACTUAL STATE IN THE REDUX STORE */
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // ITEMS PRICE GETS CALCULATED ONLY IF WE HAVE AN ORDER
  if (!loading && !error) {
    order.itemsPrice = order.orderItems
      .reduce((acc, item) => acc + item.price * item.qty, 0)
      .toFixed(2);
  }

  // PAYPAL BUTTONS
  const addPayPalScript = () => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AYgflmsaM7ccNLPlKUiufIyw8-spOE4UuS5XyyTCvhzheA-1EUcZF9qGlgXBZaSKcP5BY0zTc9WgINKe";
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  useEffect(() => {
    // IS USER IS NOT LOGGED IN THEN REDIRECT TO LOGIN PAGE
    if (!userInfo) {
      history.push("/login");
    }

    // CHECK IF WE HAVE THE ORDER DETAILS, IF NOT DISPATCH AN ACTION TO GET THE ORDER DETAILS
    if (
      !order ||
      successPay ||
      order._id !== Number(orderId) ||
      successDeliver
    ) {
      dispatch({ type: ORDER_PAY_RESET });

      dispatch({ type: ORDER_DELIVER_RESET });

      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      // ACTIVATING PAYPAL SCRIPTS
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, order, orderId, successPay, successDeliver, history, userInfo]);

  /* HANDLERS */
  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return (
     <div>
         <h1>About Us</h1>
         <p>An employee management system is a software, that helps your employees to give their best efforts every day to achieve the goals of your organization. It guides and manages employees efforts in the right direction. It also securely stores and manages personal and other work-related details for your employees.</p>
        <p>That makes it easier to store and access the data when there is a need.

In the employee management system, you can manage admin activities in an easier and quicker way. Employees are an important part of your organization it is their work that ultimately contributes to the bottom line of the company. It is an important part of HR management. It also helps to employee engagement and employee retention brings down costs and increases productivity.</p>
        <img src="https://3.imimg.com/data3/IO/VY/MY-12580193/employee-management-system-500x500.jpg" alt=""></img>
     </div>
  );
}

export default OrderScreen;
