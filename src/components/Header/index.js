import { Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

function Header() {

    const userInfo = useSelector(state => JSON.parse(state.userInfo));

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const logout = () => {

        // clear user-info key from local storage

        localStorage.removeItem("user-info");

        // update the user info state in store by dispatch method

        dispatch({type: "clearUserInfo"});

        // redirect to login page after logout process is successfuly !

        navigate("/login");

    }

    return (
        <header>
            {/* Start Navbar From Bootstrap */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-success">
                <div className="container">
                    <Link className="navbar-brand fw-bold" to="/">Online Shop</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
                        <div className="navbar-nav">
                            <Link
                                className="nav-link text-white"
                                aria-current="page"
                                to="/"
                            >
                                Home
                            </Link>
                            {userInfo &&
                                <Fragment>
                                    <Link
                                        className="nav-link text-white"
                                        to="/cart"
                                    >
                                        Cart
                                    </Link>
                                    <Link
                                        className="nav-link text-white"
                                        to="/orders"
                                    >
                                        Orders
                                    </Link>
                                </Fragment>
                            }
                            {!userInfo &&
                                <Fragment>
                                    <Link
                                        className="nav-link text-white"
                                        to="/login"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        className="nav-link text-white"
                                        to="/sign-up"
                                    >
                                        Signup
                                    </Link>
                                </Fragment>
                            }
                            {userInfo && userInfo.isAdmin &&
                                <Fragment>
                                    <Link
                                        className="nav-link text-white"
                                        to="/admin/add-product"
                                    >
                                        Add Product
                                    </Link>
                                    <Link
                                        className="nav-link text-white"
                                        to="/admin/manage-orders"
                                    >
                                        Manage Orders
                                    </Link>
                                </Fragment>
                            }
                            {userInfo &&
                                <button className="btn btn-danger" onClick={logout}>Logout</button>
                            }
                        </div>
                    </div>
                </div>
            </nav>
            {/* End Navbar From Bootstrap */}
        </header>
    );
}

export default Header;