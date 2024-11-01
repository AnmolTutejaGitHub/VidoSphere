require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
require('../database/mongoose');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../database/Models/User/User');
const Video = require('../database/Models/Video/Video')

app.use(cors({
    origin: `http://localhost:3000`,
    credentials: true
}));

app.use(express.json());

const PORT = process.env.PORT || 6969;

app.post('/login', async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const user = await User.findOne({ email, name });
        if (!user) {
            return res.status(400).send({ error: "Invalid Credentials" });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).send({ error: "Invalid Credentials" });
        }

        const token = jwt.sign({ user_id: user._id }, `${process.env.TOKEN_SECRET}`, { expiresIn: '30d' });
        res.status(200).send({ token });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

app.post('/signups', async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const user = new User({ email, password, name });
        await user.save();
        const token = jwt.sign({ user_id: user._id }, `${process.env.TOKEN_SECRET}`, { expiresIn: '30d' });
        res.status(200).send({ token });
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
})

app.post('/verifytokenAndGetUsername', async (req, res) => {
    const { token } = req.body;

    try {
        const decoded = jwt.verify(token, `${process.env.TOKEN_SECRET}`);
        const user = await User.findById(decoded.user_id);

        if (!user) {
            return res.status(404).send({ error: 'Invalid or expired token' });
        }

        res.status(200).send({ user: user.name });
    } catch (e) {
        res.status(400).send({ error: 'Invalid or expired token' });
    }
});


app.post('/otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: "anmoltutejaserver@gmail.com",
                pass: process.env.NODEMAIL_APP_PASSWORD,
            },
        });

        let mailOptions = {
            from: "anmoltutejaserver@gmail.com",
            to: email,
            subject: 'Your login OTP',
            text: `Your OTP is: ${otp}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(400).send(error);
            }
            res.status(200).send(otp);
        });

    } catch (error) {
        res.status(400).send(error);
    }
});

app.post('/getuser', async (req, res) => {
    const username = req.body.user;
    try {
        const user = await User.findOne({ name: username });
        if (!user) return res.status(400).send({ message: 'user does not exist' });

        res.status(200).send(user);
    }
    catch (e) {
        res.status(400).send({ message: "user does not exist" });
    }
})


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        resource_type: 'video',
        allowed_formats: ['mp4', 'mov', 'avi', 'mkv', 'wmv', 'flv']
    }
});

const upload = multer({
    storage: storage, limits: { fileSize: 100000000 },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /mp4|mov|avi|mkv|wmv|flv/;
        if (allowedTypes.test(file.originalname.split('.').pop().toLowerCase())) {
            cb(null, true);
        } else {
            cb(new Error('Error: File type not supported! Only video files are allowed.'));
        }
    }
});

app.post('/fileupload', upload.single('uploadfile'), async (req, res) => {

    const username = req.body.user;
    const user = await User.findOne({ name: username });
    user.uploads.push(req.file.path);
    await user.save();


    const title = req.body.title;
    const description = req.body.description;

    const video = new Video({ title: title, description: description, uploadedBy: user, url: req.file.path });
    await video.save();

    res.send({ message: 'File uploaded successfully!', url: req.file.path });
});

app.get("/allVideos", async (req, res) => {
    const all = await Video.find({}).lean();
    res.status(200).send(all);
})

app.post('/subscribe', async (req, res) => {

    const { subscribed, user, creator } = req.body;

    const subscriber = await User.findOne({ name: user });
    const Creator = await User.findOne({ name: creator });

    if (subscribed) {
        subscriber.Subscriptions.push(Creator.name);
        Creator.Subscribers += 1;
    }

    if (!subscribed) {
        subscriber.Subscriptions = subscriber.Subscriptions.filter(sub => sub !== Creator.name);
        Creator.Subscribers -= 1;
    }

    //console.log(Creator.Subscribers);

    await subscriber.save();
    await Creator.save();

    res.status(200).send('Done');
})

app.post('/isSubscribed', async (req, res) => {
    const { creator, user } = req.body;
    const subscriber = await User.findOne({ name: user });

    if (!subscriber) {
        return res.status(404).send('Subscriber not found');
    }


    const isSubscribed = subscriber.Subscriptions.some(sub =>
        sub === creator
    );

    if (isSubscribed) {
        return res.status(200).send(true);
    } else {
        return res.status(400).send(false);
    }
});


app.post('/getSubscribers', async (req, res) => {
    const { creator } = req.body;
    const Creator = await User.findOne({ name: creator });
    res.status(200).send(Creator.Subscribers);
})




app.listen(PORT, () => {
    console.log(`listening on PORT ${PORT}`)
});