import { useState } from "react";
import "./Display.css";

const Display = ({ contract, account }) => {
    const [data, setData] = useState("");

    const getdata = async () => {
        let dataArray;
        const Otheraddress = document.querySelector(".address").value;

        try {
            // If address is provided, fetch data for that address, otherwise use the account address
            if (Otheraddress) {
                dataArray = await contract.display(Otheraddress);
            } else {
                dataArray = await contract.display(account);
            }

            console.log(dataArray);

            // Check if dataArray is null or undefined
            if (!dataArray) {
                throw new Error("Data is empty");
            }

            // Check if dataArray is an object or an array (based on your contract method's return type)
            const isEmpty = Array.isArray(dataArray) ? dataArray.length === 0 : Object.keys(dataArray).length === 0;

            if (!isEmpty) {
                const str = dataArray.toString();
                const str_array = str.split(",");
                const images = str_array.map((item, i) => {
                    return (
                        <a href={item} key={i} target="_blank" rel="noopener noreferrer">
                            <img
                                key={i}
                                src={`https://gateway.pinata.cloud/ipfs/${item.substring(6)}`}
                                alt="new"
                                className="image-list"
                            />
                        </a>
                    );
                });
                setData(images);  // Update state with images
            } else {
                alert("No file to display");
                setData("");  // Clear state if no images
            }
        } catch (e) {
            alert("You don't have access or data is empty");
            setData("");  // Clear state on error
        }
    };

    return (
        <>
            <div className="image-list">{data}</div>
            <input
                type="text"
                placeholder="Enter Address"
                className="address"
            />
            <button className="center button" onClick={getdata}>
                Get Data
            </button>
        </>
    );
};

export default Display;
