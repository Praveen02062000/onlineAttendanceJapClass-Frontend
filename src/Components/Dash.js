import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteBatch, deletebatchInsta } from '../Reducer/Reducer';




function NoFoundData() {
    return (
        <div className='no-data container'>
            <h1>No Data Founded</h1>
        </div>
    )
}

function MessageAlert({ id, batchName, back }) {
    const { AlertMessage } = useSelector(state => state.maindata);
    const dispatch = useDispatch()


    console.log(AlertMessage)


    function DeleteBatchRes() {
        dispatch(DeleteBatch(id));
        dispatch(deletebatchInsta(id))
        back()
    }

    return (
        <div className='msgalert-con'>
            <div className="modal-content mc">
                <div className="modal-header">
                    <h5 className="modal-title">Confirm your command</h5>
                    <button type="button" className="btn-close " onClick={() => { back() }} ></button>
                </div>
                <div className="modal-body">
                    <p>Do you want delete {batchName} Batch ?</p>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => { back() }} >Close</button>
                    <button type="button" className="btn btn-danger" onClick={() => { DeleteBatchRes() }}>Delete</button>
                </div>
            </div>
        </div>
    )

}





function BatchCom({ title, id, batchName, navifun, setdeleteflag }) {

    const [bgcolor, setbgcolor] = useState(`rgb(${numre()},${numre()},${numre()})`);
    const [menuflag, setmenuflag] = useState(false);


    function numre() {
        return (Math.random(255) * 255).toFixed(0)
    }

    return (
        <div className='batch'>
            <div className='batch-head-con'>
                <div className='batch-menu-icon' onClick={() => setmenuflag(!menuflag)}><MoreVertIcon /></div>
                {menuflag && <div className='batch-menu-show' onMouseLeave={() => setmenuflag(false)}>
                    <div><span>Update</span></div>
                    <div onClick={() => setdeleteflag(id, title)}><span>Delete</span></div>
                </div>}
            </div>
            <div className='batch-img' style={{ backgroundColor: bgcolor }}>
                <h1>{title[0].toUpperCase()}</h1>
            </div>
            <div className='details-batch'>
                <span>{title}</span>
                <span>{batchName}</span>
            </div>
            <button className='btn btn-secondary' onClick={() => { navifun(`/viewbatch/${title}/${id}`) }}>
                View Batch
            </button>
        </div>
    )
}

function Dash() {
    const { batch } = useSelector(state => state.maindata);
    const [deleteflag, setdeleteflag] = useState({ flag: false, id: null, batchName: null });
    const navigate = useNavigate();


    function naviPage(path) {
        navigate(path)
    }

    function setdeletedetails(id, batch) {
        setdeleteflag({ flag: true, id: id, batchName: batch })
    }

    function setdeletedetailsback() {
        setdeleteflag({ flag: false, id: null, batchName: null })
    }



    return (
        <div className='dash-con' >
            {deleteflag.flag && <MessageAlert back={setdeletedetailsback} id={deleteflag.id} batchName={deleteflag.batchName} />}
            <>{!batch.load && <div className='container-fuild d-con'>
                <div className='container-xxl search-con'>
                    <div className='title-con'>
                        <h1>TSUKI NO SHOU</h1>
                        <p>Attendance App</p>
                    </div>
                    <div className='search-main-con'>
                        <div className="form-floating">
                            <input type="text" className="form-control" id="floatingPassword" placeholder="Password" />
                            <label htmlFor="floatingPassword">Search</label>
                        </div>
                    </div>
                </div>
                <div className='batch-con container-xxl '>
                    <div className='batch-add-con container-xxl'>
                        <button className='btn btn-outline-primary' onClick={() => { naviPage("/addbatch") }}>Add New Batch</button>
                    </div>
                    <div className='batch-result-con container-xxl'>
                        {batch.data.length === 0 ? <NoFoundData />
                            :
                            <>
                                {batch.data.map((val) => {
                                    return <BatchCom setdeleteflag={setdeletedetails} key={val.batch_id} title={val.title} batchName={val.levelname} id={val.batch_id} navifun={naviPage} />
                                })}
                            </>
                        }
                    </div>
                </div>
            </div>}

            </>
        </div>
    )
}

export default Dash