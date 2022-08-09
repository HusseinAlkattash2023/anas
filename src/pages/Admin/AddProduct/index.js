import { Fragment, useEffect } from "react";
import Header from "../../../components/Header/index";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function AddProduct() {

    const userInfo = useSelector(state => JSON.parse(state.userInfo));

    const navigate = useNavigate();

    useEffect(() => {

        // Protect Add Product Route

        if (!userInfo) navigate("/login");

        else if (!userInfo.isAdmin) navigate("/"); 

    }, [userInfo, navigate]);

    return (
        <Fragment>
            <Header />
            {/* Start Add Product Page */}
            <div className="add-product pt-5 pb-5">
                <h1 className="text-center fw-bold mb-5">Add Product</h1>
                {/* Start Container */}
                <div className="container text-center">
                    <form className="add-product-form" encType="multipart/form-data">
                        <input type="text" placeholder="Name" className="form-control mb-4" required />
                        <input type="number" placeholder="Price" className="form-control mb-4" required />
                        <textarea placeholder="Description" className="form-control mb-4" required></textarea>
                        <select className="form-select mb-4" required>
                            <option value="" hidden>Choose Category</option>
                            <option value="phones">Phones</option>
                            <option value="clothes">Clothes</option>
                            <option value="computers">Computers</option>
                        </select>
                        <input type="file" name="file" className="form-control mb-4" required />
                        <button type="submit" className="btn btn-primary me-4">Add Product</button>
                        <button type="reset" className="btn btn-primary">Reset</button>
                    </form>
                </div>
                {/* End Container */}
            </div>
            {/* End Add Product */}
        </Fragment>
    );
}

export default AddProduct;