import React, { useEffect, useRef, useState } from "react";
import axios from './api/axios';
import { read, utils } from 'xlsx';
import { RandomData } from './randomData.js';
import { randomData } from './functionsOfSensor.js';

const REGISTER_TRAVEL_URL = '/addTravel';

const END_TRIP = '/endTravel';

const START_TRIP = 'dataFromSensor'

const Register = () => {


    const [test, setTest] = useState("");

    const [movies, setMovies] = useState([]);

    const [callServer, setCallServer] = useState({});


    const [clickEndTravel, setClickEndTravel] = useState(false);



    useEffect(
        () => {
            if (clickEndTravel) {
                return stopCallServer();
            }
            if (clickEndTravel === false && movies.length) {
                return sendToServer(movies)
            }
        }, [test])


    const errRef = useRef();

    const [user, setUser] = useState('');

    const [pwd, setPwd] = useState('');

    const [errMsg, setErrMsg] = useState('');

    const [success, setSuccess] = useState(false);

    const [tripId, setTripId] = useState(0);

    const handleImport = ($event) => {
        const files = $event.target.files;
        if (files.length) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const wb = read(event.target.result);
                const sheets = wb.SheetNames;
                if (sheets.length) {
                    const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
                    setMovies(rows);
                }
            }
            reader.readAsArrayBuffer(file);
        }
    }


    function stopCallServer() {
        clearInterval(callServer);
        setSuccess(false);
        return sendPostToEndTrip();
    }

    function sendToServer(locations) {
        const sensorDame = new RandomData(locations)
        setCallServer(setInterval(function () {
            const data = randomData(sensorDame, tripId.tripID);
            sendPostRequest(data)
        }, 5000));

    }

    function validTravel(result) {
        if (result.tripID > 0) {
            return result.tripID;
        }
        if (result.tripID === -1) {
            setErrMsg('Vehicle number not found!');
        }
        if (result.tripID === -2) {
            setErrMsg('Username or Email not found!');
        }
        if (result.tripID === -3) {
            setErrMsg('Driver not registered in this vehicle');
        }
        errRef.current.focus();

    }

    const sendPostRequest = async (dataToServer) => {
        try {
            const resp = await axios.post(START_TRIP, dataToServer, {
                headers: {
                    'Content-Type': 'application/json'
                }
            },);
            return resp.statusText;
        } catch (err) {
            // Handle Error Here
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(REGISTER_TRAVEL_URL,
                JSON.stringify({
                    userNameOrEmail: user,
                    numVehicle: pwd
                }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        withCredentials: true
                    }
                }
            );
            if (validTravel(response.data) > 0) {
                setTripId(response.data);
                setSuccess(true);

            }
            //console.log(JSON.stringify(response?.data));
            setUser('');
            setPwd('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    }


    const sendPostToEndTrip = async () => {
        try {
            const resp = await axios.post(END_TRIP, JSON.stringify({
                tripId: tripId.tripID
            }), {
                headers: {
                    'Content-Type': 'application/json'
                }
            },);
            return resp.statusText;
        } catch (err) {
            // Handle Error Here
            console.error(err);
        }
    };
    return (
        <>
            {success ? (
                <section>
                    <div className="row mb-2 mt-5">
                        <div className="col-sm-6 offset-3">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="input-group">
                                        <div className="custom-file">
                                            <h3>Please choose file of locations</h3>
                                            <input type="file" name="file" className="custom-file-input" id="inputGroupFile" required onChange={handleImport}
                                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                                style={{
                                                    position: 'absolute',
                                                    left: '50%',
                                                    top: '45%',
                                                    transform: 'translate(-50%, -50%)'
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {movies.length ?
                                        <footer>
                                            <h1>{test}</h1>
                                            <button
                                                onClick={() => {
                                                    setClickEndTravel(false);
                                                    setTest("Travel start!");
                                                }}
                                                style={{
                                                    position: 'absolute',
                                                    left: '39%',
                                                    top: '60%',
                                                    // transform: 'translate(-50%, -50%)'
                                                }}
                                            >
                                                Start
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setClickEndTravel(true);
                                                    setTest("Travel end!");
                                                }}
                                                style={{
                                                    position: 'absolute',
                                                    left: '50%',
                                                    top: '60%',
                                                    // transform: 'translate(-50%, -50%)'
                                                }}
                                            >
                                                End of travel
                                            </button>
                                        </footer>
                                        : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Login to the sensor</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">
                            UserName Or Email:
                        </label>
                        <input
                            type="text"
                            id="username"
                            onChange={(e) => setUser(e.target.value)}
                            required
                            aria-describedby="uidnote"
                            value={user}

                        />


                        <label htmlFor="password">
                            Number Vehicle:
                        </label>
                        <input
                            type="text"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            required
                            aria-describedby="pwdnote"
                            value={pwd}
                        />

                        <button>Sign Up</button>
                    </form>

                </section>


            )}
        </>
    )
}

export default Register
