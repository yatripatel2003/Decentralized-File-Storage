import { useState } from "react";
import axios from "axios";
import "./FileUpload.css";

const FileUpload = ({ contract, account, provider }) => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("No file selected");

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submit triggered");
        if (file) {
            try {
                const formData = new FormData();
                formData.append("file", file);

                console.log("Uploading file to Pinata...");

                // Upload file to Pinata
                const resFile = await axios({
                    method: "post",
                    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                    data: formData,
                    headers: {
                        pinata_api_key: `43ca5ec910748285ac47`,
                        pinata_secret_api_key: `c3b6b826c2d594e457cbcd90cb7de9f05556a9004d5b498c57590cc8d12cd911`,
                        "Content-Type": "multipart/form-data",
                    },
                });

                console.log("Pinata Response: ", resFile.data);
                const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;

                // Add to contract
                try {
                    console.log("Adding to contract...");
                    await contract.add(account, ImgHash);
                    console.log("File added to contract successfully.");
                    alert("File successfully uploaded!"); // Show alert after successful upload
                    setFileName("No file selected");
                    setFile(null); // Reset file input after successful upload
                } catch (contractError) {
                    console.error("Error calling contract:", contractError);
                    alert("There was an issue with the contract transaction.");
                }

            } catch (e) {
                console.error("Unable to upload file to Pinata:", e);
                alert("Unable to upload file to Pinata.");
            }
        } else {
            alert("Please select a file first!"); // Optional, in case no file is selected
        }
    };

    const retrieveFile = (e) => {
        const data = e.target.files[0]; // Get the file
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(data);
        reader.onloadend = () => {
            setFile(e.target.files[0]);
        };
        setFileName(e.target.files[0].name);
        e.preventDefault();
    };

    return (
        <div className="top">
            <form className="form" onSubmit={handleSubmit}>
                <label htmlFor="file-upload" className="choose">
                    Choose File
                </label>
                <input
                    disabled={!account} // Disable if no account is connected
                    type="file"
                    id="file-upload"
                    name="data"
                    onChange={retrieveFile}
                />
                <span className="textArea">File: {fileName}</span>
                <button type="submit" className="upload" disabled={!file}>
                    Upload File
                </button>
            </form>
        </div>
    );
};

export default FileUpload;
