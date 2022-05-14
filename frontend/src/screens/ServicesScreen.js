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
    <h1>Services</h1>

    <p>An employee management system is a software, that helps your employees to give their best efforts every day to achieve the goals of your organization. It guides and manages employees efforts in the right direction. It also securely stores and manages personal and other work-related details for your employees.</p>
   <p>That makes it easier to store and access the data when there is a need.

In the employee management system, you can manage admin activities in an easier and quicker way. Employees are an important part of your organization it is their work that ultimately contributes to the bottom line of the company. It is an important part of HR management. It also helps to employee engagement and employee retention brings down costs and increases productivity.</p>
   <img height={800} width={1300} src="https://www.kindpng.com/picc/m/208-2089232_employee-leave-management-system-software-a-human-resource.png" alt=""></img>
   <h3>Managing Tasks with Employee Management Software</h3>
   <p>Resource management software also plays a role in job management. Managing tasks is the ability to describe a task, allocate it to an individual, create a deadline for the task, and recognize when it is completed.

It offers a stylish, composite functionality that enables a manager to describe, allocate, and place deadlines and to approximate hours for the tasks, while at the same time keeping a cautious gaze at the general impact those decisions on the total work schedule on individual and to all the team members’ workloads.</p>
<h3>Managing Tasks with Employee Management Software</h3>
<p>A software should also be able to provide for employees’ calendars and phone numbers as this is very important in enhancing productivity. When you have the calendar of each worker it makes it easier to plan a meeting on a date that favors all people. Project resource manager is good in sharing of calendars. It gives a free strong and very accessible service which combines personal timetables with organizational timetables to ensure you schedule meetings at convenient times.</p>
<h3>Sharing and Collaborating on Documents</h3>
<p>It is usually very difficult to send a memo or an important document to the employees one by one. It wastes time and reduces productivity. Employee Management Software supporting collaborations of documents such as central desk provides this function to managers to be able to send a message to all the employees at the same time.

Tracking Time Managers may want to acquire the time each employee gets to work or specifically how long it may take for them to work on a certain job. In this case management software is of great importance as they display directly each detail on time. This function is vital in reducing time wastage at the place of work hence increasing productivity.</p>

</div>

  );
}

export default OrderScreen;
