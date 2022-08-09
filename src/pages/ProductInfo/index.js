import { Fragment, useEffect, useState } from "react";
import Header from "../../components/Header/index";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

function ProductInfo() {

    const { productId } = useParams();

    const navigate = useNavigate();

    const { BASE_API_URL, userInfo } = useSelector(state => state);

    const [productInfo, setProductInfo] = useState({});

    const [amount, setAmount] = useState("");

    const [waitMessage, setWaitMessage] = useState("");

    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {

        axios.get(`${BASE_API_URL}/api/productInfo/${productId}`).then(res => {

            let data = res.data;

            if (typeof data === "object") {

                setProductInfo(data);

            }

        }).catch(err => console.log(err));

    }, [BASE_API_URL, productId]);

    const addToCart = (e) => {

        e.preventDefault();

        setWaitMessage("Please Wait While Verification And Add This Item To Your Cart ...");

        axios.post(`${BASE_API_URL}/api/cart`, {

            name: productInfo.name,

            price: productInfo.price,

            amount: parseInt(amount),

            productId: productInfo._id,

            userId: JSON.parse(userInfo)._id

        }).then(() => {

            setTimeout(() => {

                setWaitMessage("");

                setSuccessMessage("Ok, Add Item To Your Cart Process Is Successfuly ...");

                setTimeout(() => {

                    setSuccessMessage("");

                    navigate("/cart");

                }, 2000);

            }, 2000);

        }).catch(err => console.log(err));

    }

    return (
        <Fragment>
            <Header />
            {/* Start Product Info Page */}
            <div className="product-info pt-5 pb-5">
                <h1 className="text-center fw-bold">Product Info</h1>
                {/* Start Container */}
                <div className="container">
                    {/* Start Grid System */}
                    <div className="row">
                        {/* Start Column */}
                        <div className="col-md-6">
                            {/* Start Product Info Box */}
                            <div className="card product-info-box mb-4">
                                {/* Start Product Details List */}
                                <ul className="card-body product-details-list">
                                    <li className="product-name mb-4">
                                        Product Name: <span className="fw-bold">{productInfo.name}</span>
                                    </li>
                                    <li className="product-price mb-4">
                                        Product Price: <span className="fw-bold">{productInfo.price}</span>$
                                    </li>
                                    <li className="product-category mb-4">
                                        Product Category: <span className="fw-bold">{productInfo.category}</span>
                                    </li>
                                    <li className="product-description">
                                        Product Description: <span className="fw-bold">{productInfo.description}</span>
                                    </li>
                                    {/* Start Add To Cart Form */}
                                    {userInfo && <form
                                        className="add-to-cart-form mt-4"
                                        onSubmit={addToCart}
                                    >
                                        <input
                                            type="number"
                                            className="form-control amount"
                                            required
                                            min="1"
                                            max="6"
                                            onChange={(e) => setAmount(e.target.value)}
                                        />
                                        <button
                                            type="submit"
                                            className="btn btn-primary add-to-cart"
                                        >
                                            Add to cart
                                        </button>
                                    </form>
                                    }
                                    {/* End Add To Cart Form */}
                                </ul>
                                {/* End Product Details List */}
                            </div>
                            {/* End Product Info Box */}
                        </div>
                        {/* End Column */}
                        {/* Start Column */}
                        <div className="col-md-6">
                            {/* Start Product Image Box */}
                            <div className="product-image-box">
                                {/* Start Product Image */}
                                <img
                                    src={productInfo.productImageSrc}
                                    className="card-img-top"
                                    alt="Sorry !!"
                                />
                                {/* End Product Image */}
                            </div>
                            {/* End Product Image Box */}
                        </div>
                        {/* End Column */}
                    </div>
                    {/* End Grid System */}
                    {waitMessage && <p className="alert alert-info mt-4 text-center">{waitMessage}</p>}
                    {successMessage && <p className="alert alert-success mt-4 text-center">{successMessage}</p>}
                </div>
                {/* End Container */}
            </div>
            {/* End Product Info */}
        </Fragment>
    );
}

export default ProductInfo;