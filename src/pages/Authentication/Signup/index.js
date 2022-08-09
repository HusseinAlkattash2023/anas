import { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../../components/Header/index";
import { useSelector } from "react-redux";
import axios from "axios";

function Signup() {

    const [userName, setUserName] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [signupError, setSignUp] = useState("");

    const [signupWaitMessage, setSignupWaitMessage] = useState("");

    const [signupSuccessMessage, setSignupSuccessMessage] = useState("");

    const navigate = useNavigate();

    const userInfo = useSelector(state => JSON.parse(state.userInfo));

    useEffect(() => {

        if (userInfo) navigate("/");

    }, [userInfo, navigate]);

    const handleSubmit = e => e.preventDefault();

    const createAccount = (e) => {

        handleSubmit(e);

        // validation that the password it same confirm password

        if (password !== confirmPassword) {

            setSignUp("There is no Matches Between Password And Confirm Password !!");

            const signupTimeout = setTimeout(() => {

                setSignUp("");

                clearTimeout(signupTimeout);

            }, 2000);

        } else {

            setSignupWaitMessage("Please Wait While Verification And Signup ...");

            // create account by API Call
            axios.post(`http://localhost:3000/api/auth/signup`, { userName, password, email })

                .then(res => {

                    const signupWaitTimeout = setTimeout(() => {

                        setSignupWaitMessage("");

                        let data = res.data;

                        if (typeof data === "string") {

                            setSignUp(data);

                            const signupTimeout = setTimeout(() => {

                                setSignUp("");

                                clearTimeout(signupTimeout);

                            }, 2000);

                        } else {

                            setSignupSuccessMessage("Ok, The Signup Process Is Successfuly ...");

                            setTimeout(() => {

                                setSignupSuccessMessage("");

                                navigate("/login");

                            }, 2000);

                        }

                        clearTimeout(signupWaitTimeout);

                    }, 2000);

                })
                .catch(err => console.log(err));
        }
    }

    return (
        <Fragment>
            <Header />
            {/* Start Signup Page */}
            <div className="sign-up pt-5 pb-5">
                <h1 className="text-center fw-bold mb-5">Create Account</h1>
                {/* Start Container */}
                <div className="container text-center">
                    {/* Start Signup Form */}
                    <form className="signup-form mb-4" onSubmit={createAccount}>
                        <input
                            type="text"
                            placeholder="User Name"
                            className="form-control mb-4"
                            required
                            onChange={e => setUserName(e.target.value)}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            className="form-control mb-4"
                            required
                            onChange={e => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="form-control password mb-4"
                            required
                            pattern=".{8,}"
                            title="Password Must contain at least Eight Number"
                            onChange={e => setPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="form-control confirm-password mb-4"
                            required
                            pattern=".{8,}"
                            title="Password Must contain at least Eight Number"
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="btn btn-primary create-account-btn"
                        >Create Account</button>
                    </form>
                    {/* End Signup Form */}
                    {signupError &&
                        <p className="alert alert-danger error-in-user-side">{signupError}</p>
                    }
                    {signupWaitMessage && <p className="alert alert-info">{signupWaitMessage}</p>}
                    {signupSuccessMessage && <p className="alert alert-success">{signupSuccessMessage}</p>}
                    <h6>
                        <span>Already have account ? </span>
                        <Link to="/login">Login</Link>
                    </h6>
                </div>
                {/* End Container */}
            </div>
            {/* End Signup Page */}
        </Fragment>
    );
}

export default Signup;