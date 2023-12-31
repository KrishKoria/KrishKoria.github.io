import express from 'express';
import bodyParser from 'body-parser';
import {placesRoutes} from './routes/places-routes.js';
import {userRoutes} from "./routes/user-routes.js";
import mongoose from "mongoose";
import {HttpErrors} from "./models/http-errors.js";
import fs from 'fs';
import * as path from "path";
const app = express();

app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use('/uploads/images', express.static(path.join('uploads', 'images')));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE")
    res.setHeader('Access-Control-Allow-Private-Network', true);
    next();
});

app.use('/api/places', placesRoutes);

app.use('/api/users', userRoutes);
app.use((req, res, next) => {
    next(new HttpErrors('Could not find this route.', 404));
});
app.use((error, req, res, next) => {
    if(req.file){
        fs.unlink(req.file.path, err => {
            console.log(err);
        });
    }
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500).json({message: error.message || "An unknown error occurred!"});
});

mongoose.connect('mongodb+srv://krish:banana1234@cluster0.sirovsp.mongodb.net/TakeATrip?retryWrites=true&w=majority').then(() => {
    app.listen(5000, () => console.log('Server running on port 5000!'));
}).catch(err => {
    console.log(err);
});