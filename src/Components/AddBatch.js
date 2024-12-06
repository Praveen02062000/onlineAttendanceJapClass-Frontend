import React, { useState } from 'react';
import flImage from "../Assets/fl.png";
import { KeyboardBackspace } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import Loader from './Loader';
import { AddBatchData } from '../Reducer/Reducer';
// import { genSaltSync, hashSync } from "bcryptjs";
import { addBatchDataReducer } from '../Reducer/Reducer';
import { genSaltSync, hashSync } from 'bcryptjs';

function AddBatch() {
    const [details, setdetails] = useState({ title: "", levelname: "", createdate: "" });
    const { load, res } = useSelector(state => state.maindata.addBatchRes);
    const { batch } = useSelector(state => state.maindata);
    const dispatch = useDispatch()



    function BackHome() {
        window.history.back()
    }


    function titleSetter(e) {
        setdetails({ ...details, title: e.target.value });
    }
    function levelnameSetter(e) {
        setdetails({ ...details, levelname: e.target.value });
    }
    function datesetter(e) {
        setdetails({ ...details, createdate: e.target.value });
    }


    function idreplace(value) {
        let finalid = ""
        for (let i = 0; i < value.length; i++) {
            if (value[i] === "/") {
                finalid += "1";
            } else if (value[i] === "?") {
                finalid += "2";
            } else {
                finalid += value[i];
            }
        }

        return finalid
    }

    function CheckValue() {
        if (details.title && details.levelname && details.createdate) {
            const batch_id = hashSync("gfdhfgd", genSaltSync(7));
            const backenddata = { batch_id: idreplace(batch_id), ...details }
            dispatch(AddBatchData(backenddata))
            dispatch(addBatchDataReducer(backenddata))
            setTimeout(() => {
                setdetails({ title: "", levelname: "", createdate: "" })
            }, 500)
        }

    }

    function ResetForm() {
        setdetails({ title: "", levelname: "", createdate: "" })
    }





    return (
        <div>
            {load ? <Loader title={"Uploading..."} /> : <>
                <div className='dash-con'>
                    <div className='container-fuild d-con'>
                        <div className='container-xxl search-con'>
                            <div className='title-con'>
                                <h1>TSUKI NO SHOU</h1>
                                <p>Attendance App</p>
                            </div>
                            <div className='back-btn' onClick={() => { BackHome() }}>
                                <KeyboardBackspace titleAccess='Back' />
                            </div>
                        </div>
                        <div className='container form-add-batch'>

                            <div className='title-form'>
                                <h4>Add New Batch</h4>
                            </div>
                            <div className='container form-batch'>
                                <div className="form-floating mb-3">
                                    <input type="text" value={details.title} onChange={(e) => { titleSetter(e) }} className="form-control" id="floatingInput" placeholder="Batch Title" />
                                    <label htmlFor="floatingInput">Batch Title</label>
                                </div>
                                <div className="form-floating">
                                    <select className="form-select" onChange={(e) => { levelnameSetter(e) }} aria-label="Default select example">
                                        <option defaultValue={"Open this select menu and select the level"}>Open this select menu and select the level</option>
                                        <option value="N3">N3</option>
                                        <option value="N4">N4</option>
                                        <option value="N5">N5</option>
                                    </select>
                                </div>
                                <div className="form-floating">
                                    <input type="date" value={details.createdate} onChange={(e) => { datesetter(e) }} className="form-control" />
                                </div>
                                <div className='btn-form-add'>
                                    <button className='btn btn-primary' onClick={() => { CheckValue() }}>Add Batch</button>
                                    <button className='btn btn-danger' onClick={() => { ResetForm() }}>Reset Form</button>
                                </div>
                            </div>
                            <div className='fl-img'>
                                <img src={flImage} />
                            </div>
                            {Object.keys(res).length > 0 && <div >
                                {!res.err ? <div className="alert alert-success" role="alert">
                                    {res.status}
                                </div> : <div className="alert alert-danger" role="alert">
                                    Uploading failed
                                </div>}
                            </div>}
                        </div>


                    </div>
                </div>
            </>}
        </div>
    )
}

export default AddBatch