import { useEffect, useState } from "react";
import "./Modal.css";

const Modal = ({ setModalOpen, contract }) => {
    const [newAddress, setNewAddress] = useState("");

    const sharing = async () => {
        try {
            // Attempt to share access with the entered address
            await contract.allow(newAddress);
            setModalOpen(false); // Close the modal after sharing access
        } catch (error) {
            // Check if the error is due to transaction rejection
            if (error.code === 4001) {
                // MetaMask rejection code, handle gracefully
                window.alert("You rejected the transaction.");
            } else {
                // Handle other errors
                console.error("Error sharing access:", error);
                window.alert("An error occurred while sharing access. Please try again.");
            }
        }
    };

    useEffect(() => {
        const accessList = async () => {
            try {
                const addressList = await contract.shareAccess();
                if (Array.isArray(addressList)) {
                    let select = document.querySelector("#selectNumber");
                    addressList.forEach((opt) => {
                        let e1 = document.createElement("option");
                        e1.textContent = opt;
                        e1.value = opt;
                        select.appendChild(e1);
                    });
                } else {
                    console.error("Expected an array for addressList, but got:", addressList);
                }
            } catch (error) {
                console.error("Error fetching access list:", error);
            }
        };

        contract && accessList();
    }, [contract]);

    return (
        <div className="modalBackground">
            <div className="modalContainer">
                <div className="title">Share with</div>
                <div className="body">
                    <input
                        type="text"
                        className="address"
                        placeholder="Enter Address"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                    />
                </div>
                <form id="myForm">
                    <select id="selectNumber">
                        <option className="address">People With Access</option>
                    </select>
                </form>
                <div className="footer">
                    <button
                        onClick={() => setModalOpen(false)}
                        id="cancelBtn"
                    >
                        Cancel
                    </button>
                    <button onClick={sharing}>Share</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
