import React, { act, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { GettAllStudentData, AttendanceUpdate, deletestudentInsta, addAttendanceFun, DeleteStudent, UpdateFeeInsta, GetAttendanceFun, addInstaAttendanceData, setFeepayment } from '../Reducer/Reducer';
import { Close } from '@mui/icons-material';
import { genSaltSync, hashSync } from "bcryptjs";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { KeyboardArrowUp } from '@mui/icons-material';
import axios from 'axios';






function ViewStudentList({ student_data }) {
    // console.log(student_data)
    const [viewdetails, setviewdetails] = useState(false)
    const dispatch = useDispatch();




    function numre() {
        return `rgb(${(Math.random(255) * 255).toFixed(0)},${(Math.random(255) * 255).toFixed(0)},${(Math.random(255) * 255).toFixed(0)})`
    }

    function updatefeedispatch(id, type, boo) {
        dispatch(setFeepayment({ id: id, type: type }))
        dispatch(UpdateFeeInsta({ id: id, type: boo }));
    }

    function deleteDispatch(id) {
        dispatch(DeleteStudent(id))
        dispatch(deletestudentInsta({ id: id }))
    }



    return (
        <div className='container student-list'>
            {
                student_data.load ?
                    <div className=' container st-load'>
                        <div className="spinner-grow text-danger" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                    :
                    <div className='main-student-diplay'>
                        <div className='top-menu'> Menu<div className='st-arrow-btn' onClick={() => { setviewdetails(!viewdetails) }}>{viewdetails ? <KeyboardArrowUp style={{ fontSize: "20px" }} /> : <KeyboardArrowDownIcon style={{ fontSize: "20px" }} />}</div></div>
                        {
                            student_data.data[0].data.map(val => {

                                return (<div className='alert alert-light  st-con ' key={val.id} style={{ flexDirection: "column", display: "flex", alignItems: "start" }}>
                                    <div className='st-con-main' style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between" }}>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <div className='st-con-name-logo' style={{ backgroundColor: numre() }}>
                                                {val.name[0].toUpperCase()}
                                            </div>
                                            <div className='st-con-name-main'>
                                                <p >{val.name}</p>
                                            </div>
                                        </div>

                                    </div>
                                    {viewdetails && <div className='action-st-btn'>
                                        {val.feepayment == 1 ?
                                            <button
                                                className='btn btn-success fee-btn'
                                                title='Change Fee'
                                                onClick={() => { updatefeedispatch(val.id, "false", 0) }}
                                            >Paid</button>
                                            :
                                            <button
                                                className='btn btn-danger'
                                                title='Change Fee'
                                                onClick={() => { updatefeedispatch(val.id, "true", 1) }}
                                            >Not Paid</button>}
                                        <button className='btn btn-warning' onClick={() => { deleteDispatch(val.id) }}>Delete</button>
                                    </div>}
                                </div>)
                            })
                        }
                    </div>
            }
        </div>
    )
}


function StudentAttendanceListDisplay({ Maindata }) {
    const dispatch = useDispatch()
    const [editflag, seteditflag] = useState(false);
    const [editvalue, seteditvalue] = useState([]);


    function filterDate_Data() {
        const Filtereddata = {};
        for (const perData of Maindata) {
            Filtereddata[perData.classdate] = []
            // Filtereddata[perData.classdate].push(perData)
        }

        for (const key of Object.keys(Filtereddata)) {
            for (const value of Maindata) {
                if (key === value.classdate) {
                    Filtereddata[key].push(value)
                }
            }
        }

        // console.log(Filtereddata)

        return Filtereddata

    }

    const FinalData = filterDate_Data()


    function StringToBoo(value) {
        if (value === "true" || value === true) {
            return true
        } else {
            return false
        }
    }


    function EditAttendance(id, data) {
        console.log(data)
        if (!editflag) {
            seteditvalue(data)
            seteditflag(true);
        } else {
            seteditflag(false)
        }

    }


    function UpdateValueToView(id) {
        let final = null
        for (const x of editvalue) {
            if (x.attendance_id === id) {
                final = x.action_attend;
            }
        }

        return final === "true" ? "Present" : "Absent";
    }


    function UpdateAttendanceLocal(id, action) {
        if (action === "present") {
            const filtervalue = editvalue.map((value) => {
                if (value.attendance_id === id) {
                    return { ...value, action_attend: "true" };
                }
                return value;

            })

            seteditvalue(filtervalue);
        } else {
            const filtervalue = editvalue.map((value) => {
                if (value.attendance_id === id) {
                    return { ...value, action_attend: "false" };
                }
                return value;

            })

            seteditvalue(filtervalue);
        }
    }


    function submitUpdate() {
        dispatch(AttendanceUpdate(editvalue))
        seteditflag(false);
    }


    return (Object.keys(FinalData).map((value) => {
        return (<tr key={Object.keys(FinalData).indexOf(value)} >
            <th className={editflag ? 'edit' : 'normal'}>
                {editflag && <button className='btn btn-warning' onClick={() => { submitUpdate() }}>Submit update</button>}
                <button className='btn btn-primary' onClick={() => { EditAttendance(value, FinalData[value]) }}>{!editflag ? "Edit Attendance" : "Cancel"}</button></th>
            <th>{value}</th>
            {FinalData[value].map(valueInside => {
                return (
                    !editflag ?
                        <td key={valueInside.attendance_id} style={StringToBoo(valueInside.action_attend) ? { color: "green" } : { color: "red" }}>{StringToBoo(valueInside.action_attend) ? "Present" : "Absent"}</td> :
                        <td key={valueInside.attendance_id}>
                            <button
                                className={StringToBoo(valueInside.action_attend) ? 'btn btn-success' : 'btn btn-outline-success'}
                                onClick={() => { UpdateAttendanceLocal(valueInside.attendance_id, "present") }}
                            >Present</button>

                            <button
                                className={!StringToBoo(valueInside.action_attend) ? 'btn btn-danger' : 'btn btn-outline-danger'}
                                onClick={() => { UpdateAttendanceLocal(valueInside.attendance_id, "absent") }}
                            >Absent</button>
                            {editvalue.length > 0 && <p>{UpdateValueToView(valueInside.attendance_id)}</p>}
                        </td>

                )
            })}
        </tr>)
    }))
}





function Attandance() {
    const { batch_title, batch_id } = useParams();
    const [attendanceData, setattendanceData] = useState({ date: "", attendanceData: [] });
    const { studentData, AttendanceData } = useSelector(state => state.maindata);
    const [liststFlag, setListStFlag] = useState(false);
    const [attendFlag, setattendFlag] = useState(false);
    const [attendTake, setattendTake] = useState(false);
    const [downloadflag, setdownloadflag] = useState(false);
    const [downloadlink, setdownloadlink] = useState("");
    const dispatch = useDispatch();


    const MainBackendURL = "http://localhost:8000/student";


    async function DownloadExcel() {
        try {
            setdownloadflag(true);
            console.log("download click")
            axios.get(MainBackendURL + `/student/data/download/${batch_id}`).then((res) => {
                // if (res.data.status !== "Error") {
                //     console.log(res.data);
                //     setdownloadflag(false)
                // } else {
                //     setdownloadflag(false);
                // }

                console.log(res.data)
            }).catch(err => {
                console.log(err.message);

            })
        }
        catch (err) {
            console.log(err.message)
        }
    }

    function getData() {
        dispatch(GettAllStudentData(batch_id))
        dispatch(GetAttendanceFun(batch_id))
    }

    function BackPage() {
        window.history.back()
    }

    function getDate() {
        const date = new Date()
        return `${date.getFullYear()}-${date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`}-${date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`}`
    }

    function setInterFaceDataAttendance() {

        if (!studentData.load) {

            const FindDate = AttendanceData.data[0].data.filter(val => {
                return val.classdate === getDate();
            })

            if (FindDate.length > 0) {
                console.log("already attendance taken !")
                setattendTake(true);
            }

            else {

                const interfaceArr = studentData.data[0].data.map(val => {
                    const hashcode = hashSync("dsgfh", genSaltSync(7))
                    return { attendance_id: hashcode, studentId: val.id, batch_id: batch_id, action_attend: null, classdate: getDate() }
                })

                setattendanceData({ date: getDate(), attendanceData: interfaceArr });
                setattendFlag(true)
            }

        }
    }


    function setattendanceFlag(id, flag) {

        const newupdated = attendanceData.attendanceData.map(val => {
            if (val.studentId === id) {
                return { ...val, action_attend: flag }
            }
            return val
        })
        setattendanceData({
            ...attendanceData, attendanceData: newupdated
        })

    }




    function TableRowInsert() {
        return (<tr>
            <th className='date-view-at'>{attendanceData.date}</th>
            {attendanceData.attendanceData.length > 0 && attendanceData.attendanceData.map(val => {
                return (
                    <td >
                        <div className='at-btn'> <button className={(val.action_attend === null || !val.action_attend) && "btn btn-outline-success" || val.action_attend && "btn btn-success"} onClick={() => { setattendanceFlag(val.studentId, true) }}>Present</button>
                            <button className={(val.action_attend === null || val.action_attend) && "btn btn-outline-danger" || !val.action_attend && "btn btn-danger"} onClick={() => { setattendanceFlag(val.studentId, false) }}>Absent</button></div>
                    </td>

                )
            })}
        </tr>)
    }





    function sendAttendanceToBackend() {
        try {
            const backsenddata = { date: attendanceData.date, maindata: attendanceData.attendanceData, batch_id: batch_id }
            // console.log(backsenddata)
            setattendFlag(false)
            dispatch(addInstaAttendanceData(backsenddata.maindata))
            dispatch(addAttendanceFun(backsenddata))


        }
        catch (Err) {
            console.log(Err.message)
        }
    }



    useEffect(() => {
        getData()

    }, [])



    return (
        <div className='attendance-con container-fuild'>

            <div className='container-fuild attend-ban'>
                <div className='container-xxl search-con '>
                    <div className='title-con'>
                        <h1>TSUKI NO SHOU</h1>
                        <p>Attendance App</p>
                    </div>
                    <div className='Title-con'>
                        <h1>Batch {batch_title}</h1>
                    </div>

                </div>
            </div>
            <div className='container-fuild attend-main'>
                {liststFlag && <div className='left-con-attend'>
                    <ViewStudentList student_data={studentData} />
                </div>}
                <div className='right-con-attend' style={liststFlag ? { width: "80%" } : { width: "100%" }}>
                    <div className='container-xxl attend-main-con'>

                        <div className='back-con'>
                            <button className='btn btn-dark' onClick={() => { BackPage() }}>Back</button>
                        </div>
                        <div>
                            <button className='btn btn-outline-success' onClick={() => { DownloadExcel() }}>

                                {downloadflag ? <div className="spinner-border text-dark" role="status" style={{ width: "20px", height: "20px", borderWidth: "2px" }}>
                                    <span className="visually-hidden">Loading...</span>
                                </div> +
                                    "Fetching"
                                    :
                                    'Download'}


                            </button>
                            <button className='btn btn-outline-primary' onClick={() => { setListStFlag(!liststFlag) }}>{liststFlag ? "Close" : "View StudentList"}</button>
                            <button className='btn btn-outline-warning' style={{ color: "black" }} onClick={() => { attendFlag ? sendAttendanceToBackend() : setInterFaceDataAttendance() }}>{attendFlag ? "Submit attendance" : "Take Attendance"}</button>
                        </div>

                    </div>
                    <div className='container-fuild main-attend-con'>

                        {studentData.load ?
                            <div>

                            </div>
                            :
                            <>
                                {attendTake && <div className="alert alert-danger taken-con" role="alert">
                                    <div>Already Attendance is taken for Today : {getDate()}</div>
                                    <div onClick={() => { setattendTake(false) }}><Close /></div>
                                </div>}
                                <table className="table table-hover">

                                    <thead>
                                        <tr>
                                            <th>Edit Attendance</th>
                                            <th>Student Names</th>
                                            {studentData.data[0].data.map(studentdatavalue => {
                                                return (
                                                    <th key={studentdatavalue.id}>{studentdatavalue.name.toUpperCase()}</th>
                                                )
                                            })}
                                        </tr>

                                    </thead>
                                    <tbody>
                                        {!AttendanceData.load && <StudentAttendanceListDisplay Maindata={AttendanceData.data[0].data} />}
                                        {(attendanceData.attendanceData.length > 0 && attendFlag) && TableRowInsert()}
                                    </tbody>
                                </table>



                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Attandance