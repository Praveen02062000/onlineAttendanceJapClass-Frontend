import React, { useEffect, useState } from 'react';
import bgLogin from "../Assets/logins.jpg";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { VisibilityOff } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { LoginDispatch } from '../Reducer/Reducer';



function Login() {
    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");
    const [passFlag, setpassFlag] = useState(false);
    const [err, seterr] = useState({ user: false, pass: false })
    const { login } = useSelector(state => state.maindata);

    const dispatch = useDispatch()




    console.log(login)

    function ValidateValues(username, password) {
        const len_user = username.length;
        const len_pass = password.length;

        if (len_user > 0 && len_pass === 0) {
            seterr({ user: false, pass: true })
            return
        }
        else if (len_user === 0 && len_pass > 0) {
            seterr({ user: true, pass: false })
            return
        }
        else if (len_user === 0 && len_pass === 0) {
            seterr({ user: true, pass: true })
            return
        }
        else {
            seterr({ user: false, pass: false })
            dispatch(LoginDispatch({ username: username, password: password }))
            return
        }
    }


    useEffect(() => {

    }, [])

    return (
        <div className='login-con' style={{ backgroundImage: `url(${bgLogin})` }}>

            <div className='inner-login'>
                <h1>TSUKI NO SHOU</h1>
                <div className='form-login'>
                    <div>
                        <h2>Login</h2>
                    </div>

                    <div className='inner-form'>

                        <div className="form-floating mb-3">

                            <input
                                type="text"
                                onChange={(e) => setusername(e.target.value)}

                                className="form-control"
                                id="floatingInput"
                                placeholder='Username'
                            />

                            <label htmlFor="floatingInput" style={err.user ? { color: "red" } : { color: "black" }} >Username</label>
                        </div>

                        <div className="form-floating">

                            <input
                                type={passFlag ? "text" : "password"}
                                onChange={(e) => { setpassword(e.target.value) }}

                                className="form-control"
                                id="floatingPassword"
                                placeholder="Password"
                            />

                            <label htmlFor="floatingPassword" style={err.pass ? { color: "red" } : { color: "black" }}>Password</label>
                            <div
                                className='view-pass'
                                onClick={() => setpassFlag(!passFlag)}
                            >
                                {passFlag ? <VisibilityIcon style={{ color: "red" }} /> : <VisibilityOff />}
                            </div>

                        </div>

                    </div>

                    <div className='login-btn'>
                        <button className='btn btn-outline-danger' onClick={() => { ValidateValues(username, password) }}>Take me inside</button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Login