const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

let patients = new Object();
patients["123456789"] = ["Jensen", "Watkins", "425-231-1234"]
patients["444456789"] = ["Patrick", "Rothman", "222-653-9842"]

let records = new Object();
records["123456789"] = "Status: Healthy"
records["444456789"] = "Status: Kinda Sick"

// Get patient medical record
app.get("/records", (req, res) => {

    // validate patient exists
    // console.log(records[req.headers.ssn] === undefined)
    if (records[req.headers.ssn] === undefined) {
        res.status(404).send({"msg":"Patient not found"})
        return;
    }

    // verify ssn matches first and last name
    if (req.headers.firstname == patients[req.headers.ssn][0] && req.headers.lastname == patients[req.headers.ssn][1]) {
        if (req.body.reasonForVisit === "medicalRecords") {
            // return medical records
            res.status(200).send(records[req.headers.ssn])
            return;
        } else {
            // return error
            res.status(501).send({"msg":"Unable to copmlete request at this time: " + req.body.reasonForVisit})
            return;
        }
    }
    else {
        res.status(403).send({"msg":"First or last name did not match"})
        return;
    }


    // return appropriate record
    res.status(200).send({"msg": "HTTP GET - SUCCESS!"})
});

// Create a new patient
app.post("/", (req, res) => {
    // create patient in database
    patients[req.headers.ssn] = [req.headers.firstname, req.headers.lastname, req.headers.phone];
    res.status(201).send(patients)
    return;
});

// Update existing patient phone number
app.put("/", (req, res) => {
    // make sure patient exists
    if (records[req.headers.ssn] === undefined) {
        res.status(404).send({"msg":"Patient not found"})
        return;
    }

    // verify ssn matches first and last name
    if (req.headers.firstname == patients[req.headers.ssn][0] && req.headers.lastname == patients[req.headers.ssn][1]) {
        // update the phone number and return the patient info
        patients[req.headers.ssn] = [req.headers.firstname, req.headers.lastname, req.body.phone];
        res.status(200).send(patients[req.headers.ssn]);
        return;
    } else {
        res.status(401).send({"msg":"First or last name did not match SSN. (Trying to update Phone #)"})
        return;
    }

    res.status(200).send({"msg": "HTTP PUT - SUCCESS!"})
});

// Delete patient records
app.delete("/", (req, res) => {

        // validate patient exists
    // console.log(records[req.headers.ssn] === undefined)
    if (records[req.headers.ssn] === undefined) {
        res.status(404).send({"msg":"Patient not found"})
        return;
    }

    // verify ssn matches first and last name
    if (req.headers.firstname == patients[req.headers.ssn][0] && req.headers.lastname == patients[req.headers.ssn][1]) {
        // delete patient and medical records from database
        delete patients[req.headers.ssn];
        delete records[req.headers.ssn];

        res.status(200).send(patients);
    }
    else {
        res.status(403).send({"msg":"First or last name did not match"})
        return;
    }
});

app.listen(3000);