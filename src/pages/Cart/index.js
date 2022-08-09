import { Fragment, useEffect, useState } from "react";
import Header from "../../components/Header";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Cart() {

    const { BASE_API_URL, userInfo } = useSelector(state => state);

    const navigate = useNavigate();

    const [carts, setCarts] = useState([]);

    const [amountList, setAmountList] = useState([]);

    const [addressList, setAddressList] = useState([]);

    const [generalAddress, set_general_address] = useState("");

    const [windowInnerWidth, setWindowInnerWidth] = useState(window.innerWidth);

    const [errorMessage, setErrorMessage] = useState("");

    const [orderError, setOrderError] = useState("");

    const [orderAllError, setOrderAllError] = useState("");

    const handleSubmit = (e) => e.preventDefault();

    const handleAmountChange = (e, index) => {

        let tempAmountList = amountList.map(amount => amount);

        tempAmountList[index] = parseInt(e.target.value);

        setAmountList(tempAmountList);

    }

    const handleAddressChange = (e, index) => {

        let tempAddressList = addressList.map(address => address);

        tempAddressList[index] = e.target.value;

        setAddressList(tempAddressList);

    }

    useEffect(() => {

        axios.get(`${BASE_API_URL}/api/cart?userId=${JSON.parse(userInfo)._id}`)

            .then(res => {

                let data = res.data;

                setCarts(data);

                let tempAmountList = [];

                for (let i = 0; i < data.length; i++) {

                    tempAmountList.push(data[i].amount);

                }

                setAmountList(tempAmountList);

            }).catch(err => console.log(err));

    }, [BASE_API_URL, userInfo]);

    useEffect(() => {

        window.onresize = function () { setWindowInnerWidth(this.innerWidth) }

    }, []);

    const editItem = (productId, newAmount, index) => {

        if (amountList[index] < 1 || amountList[index] > 6) {

            setErrorMessage("Sorry Can't Edit Amount Because It Less Than One Or Greater Than 6 ...");

            const amountInputError = setTimeout(() => {

                setErrorMessage("");

                clearTimeout(amountInputError);

            }, 3000);

        } else {

            axios.put(`${BASE_API_URL}/api/cart/save/${productId}`, { newAmount }).then(() => {

                document.location.reload();

            }).catch(err => console.log(err));

        }

    }

    const deleteItem = (cartId) => {

        axios.delete(`${BASE_API_URL}/api/cart/delete/${cartId}`).then(() => {

            document.location.reload();

        }).catch(err => console.log(err));

    }

    const deleteAllItems = () => {

        axios.delete(`${BASE_API_URL}/api/cart/delete-all/${JSON.parse(userInfo)._id}`)

            .then(() => {

                document.location.reload();

            }).catch(err => console.log(err));
    }

    const orderItem = (productInfo, address, index) => {

        if (!addressList[index]) {

            setOrderError("Please Enter Your Address ..");

            const addressError = setTimeout(() => {

                setOrderError("");

                clearTimeout(addressError);

            }, 3000);

        } else {

            axios.post(`${BASE_API_URL}/api/orders`, {

                productInfo,

                address

            }).then(() => {

                navigate("/orders");

            }).catch(err => console.log(err));

        }

    }

    const orderAllItems = () => {

        if (!generalAddress) {

            setOrderAllError("Please Enter Your Address ..");

            const addressError = setTimeout(() => {

                setOrderAllError("");

                clearTimeout(addressError);

            }, 3000);

        } else {

            axios.post(`${BASE_API_URL}/api/orders/order-all-items`,

                {
                    carts,

                    generalAddress

                }

            ).then(() => {

                navigate("/orders");

            }).catch(err => console.log(err));

        }

    }

    return (
        <Fragment>
            <Header />
            {/* Start Cart Page */}
            <div className="cart pt-4 pb-4">
                <h1 className="text-center fw-bold">Cart</h1>
                {carts.length === 0 ? <div className="container">
                    <p className="alert alert-danger">There Is Not Products In Your Cart !!</p>
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
                                    <td>Processes</td>
                                </tr>
                            </thead>
                            <tbody>
                                {carts.map((cart, index) =>
                                    <tr key={cart._id}>
                                        <td>
                                            {index + 1}
                                        </td>
                                        <td>
                                            {cart.name}
                                        </td>
                                        <td>
                                            {cart.price}$
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control"
                                                defaultValue={cart.amount}
                                                onChange={(e) => handleAmountChange(e, index)}
                                            />
                                            {errorMessage && <p className="alert alert-danger mt-4">{errorMessage}</p>}
                                        </td>
                                        <td>
                                            {cart.price * cart.amount}$
                                        </td>
                                        <td>
                                            <form className="cart-form" onSubmit={handleSubmit}>
                                                <button
                                                    type="submit"
                                                    className="btn btn-success d-block mx-auto mb-3"
                                                    onClick={() => editItem(cart.productId, amountList[index], index)}
                                                >
                                                    change order amount
                                                </button>
                                                <hr />
                                                {orderError && <p className="alert alert-danger">{orderError}</p>}
                                                <input
                                                    type="text"
                                                    placeholder="Please Enter Address Then Click Order"
                                                    className="form-control mb-3"
                                                    onChange={(e) => handleAddressChange(e, index)}
                                                />
                                                <button
                                                    type="submit"
                                                    className="btn btn-success d-block mx-auto mb-3"
                                                    onClick={() => orderItem(cart, addressList[index], index)}
                                                >
                                                    Order
                                                </button>
                                                <hr />
                                                <button
                                                    type="submit"
                                                    className="btn btn-danger d-block mx-auto"
                                                    onClick={() => deleteItem(cart._id)}
                                                >
                                                    Delete
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            {carts.length > 1 && <tfoot>
                                <tr>
                                    <td colSpan="3">
                                        <form
                                            className="delete-all-products-in-your-cart-form"
                                            onSubmit={handleSubmit}
                                        >
                                            <button
                                                type="submit"
                                                className="btn btn-danger"
                                                onClick={deleteAllItems}
                                            >
                                                Delete All
                                            </button>
                                        </form>
                                    </td>
                                    <td colSpan="3">
                                        <form
                                            className="order-all-products-in-your-cart-form"
                                            onSubmit={handleSubmit}
                                        >
                                            {orderAllError && <p className="alert alert-danger">{orderAllError}</p>}
                                            <input
                                                type="text"
                                                placeholder="Please Enter Address Then Click Order All"
                                                className="form-control mb-3"
                                                onChange={(e) => set_general_address(e.target.value)}
                                            />
                                            <button
                                                type="submit"
                                                className="btn btn-success"
                                                onClick={orderAllItems}
                                            >
                                                Order All
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            </tfoot>}
                        </table>}
                        {windowInnerWidth < 767 &&
                            // Start Products Info
                            <section className="products-info">
                                {/* Start Product Details Box */}
                                {carts.map((cart, index) =>
                                    <div className="product-details-box mb-5" key={cart._id}>
                                        <h5 className="mb-4">Product #{index + 1} info :</h5>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td className="fw-bold p-3">Name</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-3">{cart.name}</td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold">Price</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-3">{cart.price}$</td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold">Amount</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-3">
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            defaultValue={cart.amount}
                                                            onChange={(e) => handleAmountChange(e, index)}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold">Total</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-3">{cart.price * cart.amount} $</td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold">Processes</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-3">
                                                        <form className="cart-form" onSubmit={handleSubmit}>
                                                            <button
                                                                type="submit"
                                                                className="btn btn-success d-block mx-auto mb-3"
                                                                onClick={() => editItem(cart.productId, amountList[index], index)}
                                                            >
                                                                change order amount
                                                            </button>
                                                            {errorMessage && <p className="alert alert-danger mt-4">{errorMessage}</p>}
                                                            <hr />
                                                            {orderError && <p className="alert alert-danger">{orderError}</p>}
                                                            <input
                                                                type="text"
                                                                placeholder="Please Enter Address Then Click Order"
                                                                className="form-control mb-3"
                                                                onChange={(e) => handleAddressChange(e, index)}
                                                            />
                                                            <button
                                                                type="submit"
                                                                className="btn btn-success d-block mx-auto mb-3"
                                                                onClick={() => orderItem(cart, addressList[index], index)}
                                                            >
                                                                Order
                                                            </button>
                                                            <hr />
                                                            <button
                                                                type="submit"
                                                                className="btn btn-danger d-block mx-auto"
                                                                onClick={() => deleteItem(cart._id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </form>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                {/* End Product Info Box */}
                                {/* Start Shortcut Processes Box */}
                                {carts.length > 1 && <h5 className="mb-4">Shortcut Processes Box :</h5>}
                                {carts.length > 1 &&
                                    <div className="shortcut-processes-box border border-3 border-success p-3">
                                        <form
                                            className="delete-all-products-in-your-cart-form mb-3 p-3 border border-3"
                                            onSubmit={handleSubmit}
                                        >
                                            <h6 className="mb-3">For Delete All Products Please On Button In Down: </h6>
                                            <button
                                                type="submit"
                                                className="btn btn-danger"
                                                onClick={deleteAllItems}
                                            >
                                                Delete All
                                            </button>
                                        </form>
                                        <form
                                            className="order-all-products-in-your-cart-form p-3 border border-3"
                                            onSubmit={handleSubmit}
                                        >
                                            {orderAllError && <p className="alert alert-danger">{orderAllError}</p>}
                                            <input
                                                type="text"
                                                placeholder="Please Enter Address Then Click Order All"
                                                className="form-control mb-3"
                                                onChange={(e) => set_general_address(e.target.value)}
                                            />
                                            <button
                                                type="submit"
                                                className="btn btn-success"
                                                onClick={orderAllItems}
                                            >
                                                Order All
                                            </button>
                                        </form>
                                    </div>}
                                {/* End Shortcut Processes Box */}
                            </section>
                        }
                    </div>
                    /* End Container */
                }
            </div>
            {/* End Cart Page */}
        </Fragment>
    );
}

export default Cart;