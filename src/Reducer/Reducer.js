import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const MainBackendURL = "http://localhost:8000/student";

export const setFeepayment = createAsyncThunk("setfee", async ({ id, type }) => {
    try {
        const setres = await (await axios.post(MainBackendURL + `/student/fee/${id}/${type}`)).data;
        console.log(setres);

        return setres
    }
    catch (err) {
        console.log(err.message)
    }
})


export const DeleteStudent = createAsyncThunk("studentdelete", async (id) => {
    try {
        const resdel = await (await axios.delete(MainBackendURL + `/studentdelete/${id}`)).data;
        console.log(resdel)
        return resdel;

    }
    catch (Err) {
        console.log(Err.message)
    }
})



export const getAllBatch = createAsyncThunk('getBatch', async () => {
    try {
        const data = (await axios.get(MainBackendURL + "/AllGetBatch")).data;

        return data
    } catch (err) {
        console.log(err.message)
        return err.message

    }

});



export const AddStudentData = createAsyncThunk("addStudent", async (datas) => {
    try {
        const responseBackend = await (await axios.post(MainBackendURL + "/addStudent", datas)).data;
        return responseBackend;
    } catch (Err) {
        console.log(Err.message)
    }
})


export const GettAllStudentData = createAsyncThunk("getstudent", async (batch_id) => {
    try {
        const responseBackend = await (await axios.get(MainBackendURL + `/getStudentbatch/${batch_id}`)).data
        return responseBackend
    }
    catch (err) {
        console.log(err.message)
    }
})



export const LoginDispatch = createAsyncThunk('login', async (datas) => {
    try {
        const loginres = await (await axios.post(MainBackendURL + "/sandhiya/login", datas)).data;
        return loginres;
    }
    catch (err) {
        console.log(err.message)
    }
});


export const AddBatchData = createAsyncThunk('addBatch', async (batchdatas) => {
    try {
        const AddBatchDataRes = await (await axios.post(MainBackendURL + "/addBatch", batchdatas)).data;
        return AddBatchDataRes;
    } catch (err) {
        console.log(err.message)
    }
})



export const addAttendanceFun = createAsyncThunk('addattendance', async (attendanceData) => {

    try {

        const addAttendanceRes = await (await axios.post(MainBackendURL + `/setAttendance/${attendanceData.batch_id}`, attendanceData)).data;
        return addAttendanceRes;
    } catch (Err) {
        console.log(Err.message);

    }
})


export const GetAttendanceFun = createAsyncThunk("getattendance", async (batch_id) => {
    try {
        const attendanceData = await (await axios.get(MainBackendURL + `/getAttendance/${batch_id}`)).data;
        return attendanceData;
    }
    catch (Err) {
        console.log(Err)
    }
})


export const DeleteBatch = createAsyncThunk("deletebatch", async (batch_id) => {
    const deleteresback = await (await axios.delete(MainBackendURL + `/deleteBatch/${batch_id}`)).data;
    return deleteresback;
})



export const AttendanceUpdate = createAsyncThunk('Attendanceupdate', async (data) => {
    try {
        const backendres = await (await axios.post(MainBackendURL + `/student/attendance/update`, data)).data;
        return backendres
    }
    catch (err) {
        console.log(err.message)
    }
})






const MainStore = {
    batch: { load: false, data: [], err: { flag: false, type: null } },
    login: { load: false, status: false, token: null, err: null },
    studentData: { load: true, err: false, data: [] },
    AttendanceData: { load: true, err: false, data: [] },
    addBatchRes: { load: false, res: {} },
    addstudentRes: { load: false, res: {} },
    addAttendance: { load: false, res: {} },
    AlertMessage: { message: null }
};


export const Reducer = createSlice({
    name: "maindata",
    initialState: MainStore,
    reducers: {

        deletestudentInsta: (state, action) => {
            const { id } = action.payload;
            const student = state.studentData.data[0].data.filter(val => {
                return val.id !== id;
            })
            const attendStudent = state.AttendanceData.data[0].data.filter(val => {
                return val.id !== id;
            })

            return {
                ...state,
                studentData: { ...state.studentData, data: [{ err: false, data: student }] },
                AttendanceData: { ...state.AttendanceData, data: [{ data: attendStudent, err: false, status: "successfully" }] }
            }
        },

        UpdateFeeInsta: (state, action) => {
            const { id, type } = action.payload;
            const newStudentDate = state.studentData.data[0].data.map(val => {
                if (val.id === id) {
                    return { ...val, feepayment: type }
                }
                return val;
            })

            return { ...state, studentData: { ...state.studentData, data: [{ err: false, data: newStudentDate }] } }

        },

        addBatchDataReducer: (state, action) => {
            if (action.payload) {
                return { ...state, batch: { ...state.batch, data: [...state.batch.data, action.payload] } }
            }
        },
        addInstaAttendanceData: (state, action) => {
            if (action.payload) {
                let attendancedata = state.AttendanceData.data[0].data;
                // return { ...state, AttendanceData: { ...state.AttendanceData, data[0]: { ...state.AttendanceData.data[0], data: [...state.AttendanceData.data[0].data, ...action.payload] } } }
                return { ...state, AttendanceData: { ...state.AttendanceData, data: [{ ...state.AttendanceData.data[0], data: [...state.AttendanceData.data[0].data, ...action.payload] }] } }

            }
        },
        deletebatchInsta: (state, action) => {
            const filterdata = state.batch.data.filter(value => {
                return value.batch_id !== action.payload
            })
            return { ...state, batch: { ...state.batch, data: filterdata } }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllBatch.pending, (state) => {
                try {
                    state.batch.load = true;
                } catch (err) {
                    console.log("err on get all batch pending side");
                }
            })
            .addCase(getAllBatch.fulfilled, (state, action) => {
                try {
                    if (action.payload === "Network Error") {
                        state.batch.load = false;
                        state.batch.err = { flag: true, type: action.payload }
                        state.batch.data = []
                    } else {
                        state.batch.load = false;
                        state.batch.data = action.payload;
                        state.batch.err = { flag: false, type: null }
                    }
                } catch (err) {
                    console.log(err.message)
                }
            })
            .addCase(getAllBatch.rejected, (state, action) => {
                try {
                    state.batch.load = false;
                    state.batch.err = { flag: true, type: action.error.message };
                }
                catch (err) {
                    console.log("err on get all student rejected side");
                }
            })




            // login fetch

            .addCase(LoginDispatch.pending, (state) => {
                try {
                    state.login.load = true;
                }
                catch (err) {
                    console.log(err.message);

                }
            })

            .addCase(LoginDispatch.fulfilled, (state, action) => {
                state.login.load = false;
                state.login.status = true;
                state.login.token = action.payload;
                state.login.err = null;
                sessionStorage.setItem("sandhiyalogin", JSON.stringify(action.payload))
            })



            .addCase(AddBatchData.pending, (state) => {
                state.addBatchRes.load = true;
            })

            .addCase(AddBatchData.fulfilled, (state, action) => {
                state.addBatchRes = { load: false, res: action.payload }
            })



            // student resposns

            .addCase(AddStudentData.pending, (state) => {
                state.addstudentRes.load = true;
            })

            .addCase(AddStudentData.fulfilled, (state, action) => {
                state.addstudentRes = { load: false, res: action.payload }
            })


            // student get response 

            .addCase(GettAllStudentData.pending, (state) => {
                state.studentData.load = true;
            })
            .addCase(GettAllStudentData.fulfilled, (state, action) => {
                state.studentData = { load: false, data: [action.payload], err: false };
            })
            .addCase(GettAllStudentData.rejected, (state, action) => {
                state.studentData = { load: false, data: [], err: action.error.message };
            })


            // student attendance 
            .addCase(addAttendanceFun.pending, (state) => {
                state.addAttendance.load = true;
            })

            .addCase(addAttendanceFun.fulfilled, (state, action) => {
                state.addAttendance = { load: false, res: action.payload }
            })


            .addCase(GetAttendanceFun.pending, (state) => {
                state.AttendanceData.load = true;
            })
            .addCase(GetAttendanceFun.fulfilled, (state, action) => {
                state.AttendanceData = { load: false, data: [action.payload], err: false };
            })
            .addCase(GetAttendanceFun.rejected, (state, action) => {
                state.AttendanceData = { load: false, data: [], err: action.error.message };
            })



            .addCase(DeleteBatch.fulfilled, (state, action) => {
                state.AlertMessage.message = action.payload
            })

            .addCase(AttendanceUpdate.fulfilled, (state, action) => {

            })
    }
});



export const { addBatchDataReducer, deletestudentInsta, UpdateFeeInsta, addInstaAttendanceData, deletebatchInsta } = Reducer.actions
export default Reducer.reducer