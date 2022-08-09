import { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../../components/Header/index";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

function Login() {

    const handleSubmit = e => e.preventDefault();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [waitMessage, setWaitMessage] = useState("");

    const [loginError, setLoginError] = useState("");

    const globalState = useSelector(state => state);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    useEffect(() => {

        // Protect Login Route

        if (globalState.userInfo) navigate("/");

    }, [globalState.userInfo, navigate]);

    function loginNow(email, password) {

        setWaitMessage("Please Wait While Verification And Logging In ...");
        
        axios.get(`${globalState.BASE_API_URL}/api/auth/login?email=${email}&password=${password}`)
            .then(res => {
                let data = res.data;
                if (typeof data == "string") {
                    setLoginError(data);
                    setTimeout(() => {
                        setLoginError("");
                    }, 2000);
                } else {
                    localStorage.setItem("user-info", JSON.stringify(data));
                    dispatch({ type: "setUserInfo" });
                    setTimeout(() => {
                        setWaitMessage("");
                        navigate("/");
                    }, 2000);
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <Fragment>
            {/* Start Login Page */}
            <Header />
            <div className="login pt-5 pb-5">
                <h1 className="text-center fw-bold mb-5">Login</h1>
                {/* Start Container */}
                <div className="container text-center">
                    {/* Start Login Form */}
                    <form className={`login-form ${loginError ? "mb-4" : "mb-5"}`} onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Email"
                            className="form-control mb-4"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="form-control mb-4"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary create-account-btn" onClick={() => loginNow(email, password)}>Login</button>
                    </form>
                    {/* End Login Form */}
                    {loginError && <p className="alert alert-danger">{loginError}</p>}
                    {waitMessage && <p className="alert alert-info">{waitMessage}</p>}
                    <h6>
                        <span>Don't have account ? </span>
                        <Link to="/sign-up">Create Account</Link>
                    </h6>
                </div>
                {/* End Container */}
            </div>
            {/* End Login Page */}
        </Fragment>
    );
}

export default Login;