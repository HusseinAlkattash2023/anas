import { Fragment, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "../../components/Header/index";
import axios from "axios";

function Orders() {

    const BASE_API_URL = useSelector(state => state.BASE_API_URL);

    const userInfo = useSelector(state => state.userInfo);

    const [orders, setOrders] = useState([]);

    const [windowInnerWidth, setWindowInnerWidth] = useState(window.innerWidth);

    useEffect(() => {

        axios.get(`${BASE_API_URL}/api/orders?userId=${JSON.parse(userInfo)._id}`)

            .then(res => {

                setOrders(res.data);

            }).catch(err => console.log(err));

    }, [BASE_API_URL, userInfo]);

    useEffect(() => {

        window.onresize = function () { setWindowInnerWidth(this.innerWidth) }

    }, []);

    const handleSubmit = (e) => e.preventDefault();

    const cancelOrder = (orderId) => {

        axios.delete(`${BASE_API_URL}/api/orders/cancel/${orderId}`)

            .then(() => {

                document.location.reload();

            }).catch(err => console.log(err));

    }

    const cancelAllOrders = () => {

        axios.delete(`${BASE_API_URL}/api/orders/cancel-all/${JSON.parse(userInfo)._id}`)

            .then(() => {

                document.location.reload();

            }).catch(err => console.log(err));

    }

    return (
        <Fragment>
            <Header />
            {/* Start Orders Page */}
            <div className="orders pt-5 pb-5">
                <h1 className="text-center fw-bold">Orders</h1>
                {orders.length === 0 ? <div className="container">
                    <p className="alert alert-danger">There Is Not Orders In Your Cart !!</p>
                </div> :
                    /* Start Container */
                    <div className="container text-center">
                        {windowInnerWidth > 767 && <table>
                            <thead className="fw-bold">
                                <tr>
                                    <td>no</td>
                                    <td>Product Name</td>
                                    <td>Price</td>
                                    <td>Amount</td>
                                    <td>Total</td>
                                    <td>Status</td>
                                    <td>Time</td>
                                    <td>Order Cancel</td>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) =>
                                    <tr key={order._id}>
                                        <td>
                                            {index + 1}
                                        </td>
                                        <td>
                                            {order.name}
                                        </td>
                                        <td>
                                            {order.price}
                                        </td>
                                        <td>
                                            {order.amount}
                                        </td>
                                        <td>
                                            {order.price * order.amount}$
                                        </td>
                                        <td className="fw-bold">
                                            {order.status}
                                        </td>
                                        <td>
                                            {order.time}
                                        </td>
                                        <td>
                                            {order.status === "Pending" ? <form
                                                className="cancel-order-form"
                                                onSubmit={handleSubmit}
                                            >
                                                <button
                                                    type="submit"
                                                    className="btn btn-danger"
                                                    onClick={() => cancelOrder(order._id)}
                                                >
                                                    Cancel
                                                </button>
                                            </form> : "unavailable now"
                                            }
                                        </td>
                                    </tr>)}
                            </tbody>
                            <tfoot>
                                {orders.length > 1 && <tr>
                                    <td colSpan="8">
                                        <form
                                            className="cancel-all-orders-form"
                                            onSubmit={handleSubmit}
                                        >
                                            <button
                                                type="submit"
                                                className="btn btn-danger mb-3"
                                                onClick={cancelAllOrders}
                                            >
                                                Cancel All Orders
                                            </button>
                                            <p className="mb-2 fw-bold">(For Orders That Her Status is Just Pending)</p>
                                        </form>
                                    </td>
                                </tr>}
                            </tfoot>
                        </table>}
                        {windowInnerWidth < 767 &&
                            // Start Orders Info
                            <section className="orders-info">
                                {/* Start Product Details Box */}
                                {orders.map((order, index) =>
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
                                                    <td className="fw-bold">Order Cancel</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        {order.status === "Pending" ? <form
                                                            className="cancel-order-form"
                                                            onSubmit={handleSubmit}
                                                        >
                                                            <button
                                                                type="submit"
                                                                className="btn btn-danger"
                                                                onClick={() => cancelOrder(order._id)}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </form> : "unavailable now"
                                                        }
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                {/* End Product Info Box */}
                                {/* Start All Orders Cancel Box */}
                                <h5 className="mb-4">All Orders Cancel Box :</h5>
                                {orders.length > 1 &&
                                    <div className="all-orders-cancel-box border border-3 border-success p-3">
                                        <form
                                            className="cancel-all-orders-form"
                                            onSubmit={handleSubmit}
                                        >
                                            <button
                                                type="submit"
                                                className="btn btn-danger mb-3"
                                                onClick={cancelAllOrders}
                                            >
                                                Cancel All Orders
                                            </button>
                                            <p className="mb-2 fw-bold">(For Orders That Her Status is Just Pending)</p>
                                        </form>
                                    </div>}
                                {/* End All Orders Cancel Box */}
                            </section>
                        }
                    </div>
                    /* End Container */
                }
            </div>
            {/* End Orders Page */}
        </Fragment>
    );
}

export default Orders;