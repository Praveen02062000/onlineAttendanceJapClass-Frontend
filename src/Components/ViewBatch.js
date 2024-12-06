import React, { useEffect, useState } from 'react';
import { Close, Delete, KeyboardBackspace } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from "../Components/Loader";
import { AddStudentData, GettAllStudentData } from '../Reducer/Reducer';
import { genSaltSync, hashSync } from 'bcryptjs';


function AddStudent({ batch_id }) {
    const [details, setdetails] = useState({ batch_id: batch_id, name: "", feepayment: false });
    const [overall, setoverall] = useState([]);
    const { addstudentRes } = useSelector(state => state.maindata);
    const [alertflag, setalertflag] = useState(false);
    const dispatch = useDispatch();


    function DeleteItem(indexid) {
        setoverall(overall.filter(val => {
            return overall.indexOf(val) != indexid
        }));
    }

    // console.log(addstudentRes)


    function setterName(event, type) {
        if (type === "name") {
            setdetails({ ...details, name: event.target.value });
        } else {
            if (event.target.value === "yes") {
                setdetails({ ...details, feepayment: true });
            } else {
                setdetails({ ...details, feepayment: false });
            }
        }
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



    function setData() {
        if (details.name) {
            const batch = hashSync("gfdhfgd", genSaltSync(7));
            // setdetails({ ...details, id: idreplace(batch_id) })
            const backendData = { id: idreplace(batch), ...details }
            setoverall([...overall, backendData])
            setdetails({ batch_id: batch_id, name: "", feepayment: false })

        }
    }

    function SendBackend() {
        try {
            if (overall.length > 0) {

                dispatch(AddStudentData(overall));
                setoverall([])
                setalertflag(true)
            }
        }
        catch (err) {
            console.log(err.message)
        }
    }


    function setFlag() {
        setalertflag(false)
    }


    return (
        <div className='add-student container' >
            {alertflag && <div className='container success-st-up'>
                {addstudentRes.res.err ?
                    <div className='alert alert-danger' role='alert'>
                        Upload failed <div onClick={() => { setFlag() }}><Close /></div>
                    </div> :
                    < div className="alert alert-success" role="alert">
                        Successfully uploaded <div onClick={() => { setFlag() }}><Close /></div>
                    </div>
                }
            </div>}
            <div className="form-floating mb-3">
                <input type="text" className="form-control" value={details.name} onChange={(e) => { setterName(e, "name") }} id="floatingInput" placeholder="Student Name" />
                <label htmlFor="floatingInput">Student Name</label>
            </div>
            <div className="form-floating">
                <select className="form-select" onChange={(e) => { setterName(e, "fee") }} aria-label="Default select example">
                    <option defaultValue={"0"}>Fee Payment</option>
                    <option value="yes">yes</option>
                    <option value="no">no</option>
                </select>
            </div>
            <div className='container item-st-con'>
                {overall.map(value => {
                    return (<div key={overall.indexOf(value)} className="alert alert-secondary st-item" role="alert">
                        <div>
                            <span>Name : {value.name}</span>
                        </div>
                        <div>
                            <button onClick={() => { DeleteItem(overall.indexOf(value)) }} className='btn btn-danger'> <Delete />Delete</button>
                        </div>
                    </div>)
                })

                }
            </div>
            <div className='btn-form-add'>
                <button className='btn btn-warning' onClick={() => { setData() }}>Set Data</button>
                <button className='btn btn-primary' onClick={() => { SendBackend() }}>Add Student</button>
                <button className='btn btn-danger' >Reset Form</button>
            </div>
        </div >
    )
}




function ViewBatch() {
    const { title, id } = useParams();
    const { data, load } = useSelector(state => state.maindata.batch);
    const [actiontype, setactiontype] = useState({ addst: true, deletebt: false })
    const { studentData } = useSelector(state => state.maindata);
    const navigate = useNavigate()
    const dispatch = useDispatch()



    function BackHome() {
        window.history.back()
    }


    function setplaceView(type) {
        switch (type) {
            case "addst":
                setactiontype({ addst: true, deletebt: false })
                break;
            case "deletebt":
                setactiontype({ addst: false, deletebt: true })
                break;
        }
    }


    function getData() {
        dispatch(GettAllStudentData(id))
    }



    useEffect(() => {
        getData()
    }, [data])
    return (
        <>
            {data.length > 0 ? <div className='dash-con '>
                <div className='container-fuild d-con view-con'>
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
                            <h4>{title} Batch</h4>
                        </div>

                        <div className='container view-batch-btn'>
                            <button className='btn btn-primary' onClick={() => { setplaceView("addst") }}>Add Student</button>
                            <button className='btn btn-success' onClick={() => { navigate(`/attendancesheet/${title}/${id}`) }}>Attendance</button>
                        </div>
                        <div className='container'>
                            {actiontype.addst && <AddStudent batch_id={id} />}
                        </div>


                    </div>


                </div>
            </div> : <Loader />}
        </>

    )
}

export default ViewBatch