import { Fragment, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header/index";
import { useSelector } from "react-redux";
import axios from "axios";
import img1 from "../../assets/images/labtop.jpg";
import img2 from "../../assets/images/android-phone.jpg";
import img3 from "../../assets/images/android-tablet.jpg";
import img4 from "../../assets/images/clothes.jpg";

function Home() {

  const BASE_API_URL = useSelector(state => state.BASE_API_URL);

  const userInfo = useSelector(state => state.userInfo);

  const [category, setCategory] = useState("");

  const [products, setProducts] = useState([]);

  const [notFoundProductsError, setNotFoundProductsError] = useState("");

  const [images] = useState([img1, img2, img3, img4]);

  const handleSubmit = e => e.preventDefault();

  const getAllProducts = useCallback(() => {

    axios.get(`${BASE_API_URL}/api/products`)

      .then(res => {

        let data = res.data;

        if (typeof data === "string") {

          setNotFoundProductsError(data);

        } else {

          setProducts(data);

        }

      })

      .catch(err => console.log(err));

  }, [BASE_API_URL])

  const get_products_by_category = (e) => {

    handleSubmit(e);

    if (category === "all") {

      getAllProducts();

    } else {

      axios.get(`${BASE_API_URL}/api/products/determinate-products?category=${category}`)

        .then(res => {

          let data = res.data;

          if (typeof data === "string") {

            setNotFoundProductsError(data);

          } else {

            setProducts(data);

          }

        })

        .catch(err => console.log(err));

    }

  }

  const showProducts = () => {
    const listOfProducts = products.map((product, index) =>
      /* Start Column */
      <div className="col-lg-4" key={product._id}>
        {/* Start Product Info Box */}
        <div className="card product-info-box mb-5">
          {/* Start Product Image Box */}
          <div className="product-image-box mb-4">
            {/* Start Product Image */}
            <img
              src={images[index]}
              className="card-img-top"
              style={{ height: "250px" }}
              alt="Sorry !!"
            />
            {/* End Product Image */}
          </div>
          {/* End Product Image Box */}
          {/* Start Product Details List */}
          <ul className="card-body product-details-list">
            <li className="mb-2">
              Product Name:
              <Link className="card-title product-name"
                to={"/product-info/" + product._id}
              >
                <span className="fw-bold"> {product.name}</span>
              </Link>
            </li>
            <li className="product-price mb-2">
              Product Price: <span className="fw-bold">{product.price}</span>$
            </li>
            <li className="product-category mb-2">
              Product Category: <span className="fw-bold">{product.category}</span>
            </li>
            <li className="card-text product-description mb-2">
              Product Description: <span className="fw-bold">{product.description}</span>
            </li>
            {userInfo && <Link
              className="btn btn-primary add-to-cart w-100 mt-3"
              to={"/product-info/" + product._id}
            >
              Add to cart
            </Link>
            }
          </ul>
          {/* End Product Details List */}
        </div>
        {/* End Product Info Box */}
      </div>
      /* End Column */
    );
    return (
      // Start Grid System
      <div className="row">
        {listOfProducts}
      </div>
    );
  }

  useEffect(() => {

    getAllProducts();

  }, [getAllProducts]);

  return (
    <Fragment>
      {/* Start Home Page */}
      <Header />
      <div className="home pt-5 pb-5">
        {/* Start Container */}
        <div className="container">
          <h1 className="text-center fw-bold mb-5">Home Page - Products Gallery</h1>
          {/* Start Products Filter Form */}
          <form
            className="products-filter-form text-center mb-4"
            onSubmit={get_products_by_category}
          >
            <select className="form-select" onChange={(e) => setCategory(e.target.value)}>
              <option value="" hidden>Choose Category</option>
              <option value="all">All</option>
              <option value="phones">Phones</option>
              <option value="clothes">Clothes</option>
              <option value="computers">Computers</option>
            </select>
            <button type="submit" className="btn btn-danger products-filter-button mt-4">Products Filter</button>
          </form>
          {/* End Products Filter Form */}
          {
            notFoundProductsError ? <p className="alert alert-danger">{notFoundProductsError}</p>
              :
              showProducts()
          }
          {/* End Container */}
        </div>
      </div>
      {/* End Home Page */}
    </Fragment>
  );
}

export default Home;