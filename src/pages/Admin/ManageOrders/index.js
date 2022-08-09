import { Fragment, useState, useEffect, useCallback } from "react";
import Header from "../../../components/Header";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ManageOrders() {

    const navigate = useNavigate();

    const userInfo = useSelector(state => state.userInfo);

    const BASE_API_URL = useSelector(state => state.BASE_API_URL);

    const [ordersStatus, setOrdersStatus] = useState([]);

    const [listOrdersByStatus, setOrdersByStatus] = useState([]);

    const [isInitOrdersData, setIsInitOrdersData] = useState(false);

    const [windowInnerWidth, setWindowInnerWidth] = useState(window.innerWidth);

    const getSpecificOrders = (orderStatus) => {

        axios.get(`${BASE_API_URL}/api/admin/manage-orders/orders/specific-orders?orderStatus=${orderStatus}`).then(res => {

            setOrdersByStatus(res.data);

        });

    }

    const getAllOrders = useCallback(() => {

        axios.get(`${BASE_API_URL}/api/admin/manage-orders/orders/all-orders`).then(res => {

            if (res.data.length > 0) {

                setOrdersByStatus(res.data);

                setIsInitOrdersData(true);

            }

        });

    }, [BASE_API_URL]);

    useEffect(() => {

        // Protect Add Product Route

        if (!userInfo) navigate("/login");

        else if (!JSON.parse(userInfo).isAdmin) navigate("/");

        else {

            getAllOrders();

        }

    }, [userInfo, navigate, getAllOrders]);

    useEffect(() => {

        window.onresize = function () { setWindowInnerWidth(this.innerWidth) }

    }, []);

    const handleSubmit = (e) => e.preventDefault();

    const handle_order_status_change = (e, index) => {

        let temp_orders_status_list = ordersStatus;

        temp_orders_status_list[index] = e.target.value;

        setOrdersStatus(temp_orders_status_list);

    }

    const editOrderStatus = (orderIndex) => {

        axios.put(`${BASE_API_URL}/api/admin/manage-orders/edit-order-status/${listOrdersByStatus[orderIndex]._id}`, {

            newOrderStatus: ordersStatus[orderIndex]

        }).then(() => {

            document.location.reload();

        }).catch(err => console.log(err));

    }

    return (
        <Fragment>
            <Header />
            {/* Start Manage Orders Page */}
            <div className="orders pt-5 pb-5">
                <h1 className="text-center fw-bold mb-5">Manage Orders</h1>
                {/* Start Container */}
                <div className="container text-center">
                    {(listOrdersByStatus.length > 0 || isInitOrdersData) && <form className="orders-filter-form mb-5" onSubmit={handleSubmit}>
                        <button
                            type="submit"
                            className={`btn btn-primary ${windowInnerWidth > 991 ? "me-3" : "d-block mx-auto mb-3 w-100"}`}
                            onClick={getAllOrders}>All</button>
                        <button
                            type="submit"
                            className={`btn btn-primary ${windowInnerWidth > 991 ? "me-3" : "d-block mx-auto mb-3 w-100"}`}
                            onClick={() => getSpecificOrders("Pending")}
                        >
                            Pending
                        </button>
                        <button
                            type="submit"
                            className={`btn btn-primary ${windowInnerWidth > 991 ? "me-3" : "d-block mx-auto mb-3 w-100"}`}
                            onClick={() => getSpecificOrders("Sent")}
                        >
                            Sent
                        </button>
                        <button
                            type="submit"
                            className={`btn btn-primary ${windowInnerWidth > 991 ? "me-3" : "d-block mx-auto mb-3 w-100"}`}
                            onClick={() => getSpecificOrders("Completed")}
                        >
                            Completed
                        </button>
                    </form>}
                    {listOrdersByStatus.length === 0 ?
                        <p className="alert alert-danger">There Is Not Orders !!</p> :
                        windowInnerWidth > 991 ?
                            <table>
                                <thead className="fw-bold">
                                    <tr>
                                        <td>no</td>
                                        <td>Product Name</td>
                                        <td>Price</td>
                                        <td>Amount</td>
                                        <td>Total</td>
                                        <td>Address</td>
                                        <td>Status</td>
                                        <td>Change Status</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listOrdersByStatus.map((order, index) =>
                                        <tr key={order._id}>
                                            <td>
                                                {index + 1}
                                            </td>
                                            <td>
                                                {order.name}
                                            </td>
                                            <td>
                                                {order.price}$
                                            </td>
                                            <td>
                                                {order.amount}
                                            </td>
                                            <td>
                                                {order.price * order.amount}$
                                            </td>
                                            <td>
                                                {order.address}
                                            </td>
                                            <td>
                                                {order.status}
                                            </td>
                                            <td className="fw-bold">
                                                <form onSubmit={handleSubmit} className="order-status-form">
                                                    <select
                                                        className="status-select form-select mb-3"
                                                        onChange={(e) => handle_order_status_change(e, index)}
                                                    >
                                                        <option value="" hidden>Choose New Status Order</option>
                                                        <option value="Pending">Pending</option>
                                                        <option value="Sent">Sent</option>
                                                        <option value="Completed">Completed</option>
                                                    </select>
                                                    <button
                                                        className="btn btn-danger"
                                                        onClick={() => editOrderStatus(index)}
                                                    >
                                                        Save
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table> :
                            // Start Orders Info
                            <section className="orders-info">
                                {/* Start Product Details Box */}
                                {listOrdersByStatus.map((order, index) =>
                                    <div className="order-details-box mb-5" key={order._id}>
                                        <h5 className="mb-4">Order #{index + 1} info :</h5>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td className="fw-bold p-3">Product Name</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-3">{order.name}</td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold">Price</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-3">{order.price}$</td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold">Amount</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-3">{order.amount}</td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold">Total</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-3">{order.price * order.amount} $</td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold">Status</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-3 text-danger fw-bold">{order.status}</td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold">Change Stauts</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <form onSubmit={handleSubmit} className="order-status-form">
                                                            <select
                                                                className="status-select form-select mb-3"
                                                                onChange={(e) => handle_order_status_change(e, index)}
                                                            >
                                                                <option value="" hidden>Choose New Status Order</option>
                                                                <option value="Pending">Pending</option>
                                                                <option value="Sent">Sent</option>
                                                                <option value="Completed">Completed</option>
                                                            </select>
                                                            <button
                                                                className="btn btn-danger"
                                                                onClick={() => editOrderStatus(index)}
                                                            >
                                                                Save
                                                            </button>
                                                        </form>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                {/* End Product Info Box */}
                            </section>
                    }
                </div>
                {/* End Container */}
            </div>
            {/* End Manage Orders Page */}
        </Fragment>
    );
}

export default ManageOrders;