import axios from "axios";
import {randomData} from './functionsOfSensor.js';
export const sendPostRequest = async () => {
    try {
        const resp = await axios.post('http://localhost:3000/dataFromSensor', dateDemo, {
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

setInterval(randomData, 5000);
//setInterval(sendPostRequest, 10000);

