const sanitize = require("mongo-sanitize");

const UserModel = require("../models/user");
const tool = require("../services/tool");

let trainerRegister = (req, res, next) => {
    req.body = sanitize(req.body);

    var _id = req.body._id || null;

    if (req.user.type === 'ADMIN') {
        req.check('name', `Invalid name`).notEmpty();
        if (_id == null) {
            req.check('password', 'Invalid password').notEmpty().isLength({ min: 8 });
            req.check('emailid', ` Invalid email address`).isEmail().notEmpty();
        }

        req.check('contact', 'Invalid contact number').isLength({ min: 13, max: 13 }).isNumeric({ no_symbols: false });
        var errors = req.validationErrors();

        if (errors) {
            res.json({
                success: false,
                message: 'Invalid inputs',
                errors: errors
            });
        }
        else {
            var name = req.body.name;
            var password = req.body.password;
            var emailid = req.body.emailid;
            var contact = req.body.contact;
            var status = null || req.body.status;
            var organisation = req.body.organisation;
            var avatar = req.body.avatar;
            var bio = req.body.bio;

            if (_id != null) {
                UserModel.findOneAndUpdate({
                    _id: _id,
                    // status: 1
                },
                {
                    name: name,
                    contact: contact,
                    status: status,
                    organisation: organisation,
                    avatar: avatar,
                    bio: bio
                })
                .then(() => {
                    res.json({
                        success: true,
                        message: `Trainer's Profile updated successfully!`
                    });
                })
                .catch((err) => {
                    res.status(500).json({
                        success: false,
                        message: "Unable to update Trainer's Profile"
                    });
                });
            }
            else {
                UserModel.findOne({ 'emailid': emailid, status: 1 }).then((user) => {
                    if (!user) {
                        tool.hashPassword(password).then((hash) => {
                            var tempdata = new UserModel({
                                name: name,
                                password: hash,
                                emailid: emailid,
                                contact: contact,
                                createdBy: req.user._id,
                                organisation: organisation,
                                avatar: avatar,
                                bio: bio
                            });

                            tempdata
                            .save()
                            .then((data) => {
                                res.json({
                                    success: true,
                                    message: `Trainer's Profile created successfully!`,
                                    data: data
                                });
                            })
                            .catch((err) => {
                                res.status(500).json({
                                    success: false,
                                    message: "Unable to create Trainer's Profile"
                                });
                            })
                        })
                        .catch((err) => {
                            res.status(500).json({
                                success: false,
                                message: "Unable to create Trainer's Profile"
                            });
                        });                        
                    }
                    else {
                        res.json({
                            success: false,
                            message: `This id already exists!`
                        });
                    }
                })
                .catch((err) => {
                    res.status(500).json({
                        success: false,
                        message: "Unable to create Trainer Profile"
                    });
                });
            }
        }
    }
    else {
        res.status(401).json({
            success: false,
            message: "Permissions not granted!"
        });
    }
};

let removeTrainer = (req, res, next) => {
    req.body = sanitize(req.body);

    if (req.user.type === 'ADMIN') {
        var _id = req.body._id;

        UserModel.findOneAndUpdate({_id: _id},{ status: 0})
        .then(() => {
            res.json({
                success: true,
                message: "Account has been removed"
            });
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: "Unable to remove account"
            });
        });
    }
    else {
        res.status(401).json({
            success: false,
            message: "Permissions not granted!"
        });
    }
};

let getAllTrainers = (req, res, next) => {
    req.body = sanitize(req.body);

    if (req.user.type === 'ADMIN') {
        UserModel.find(
            {
                type: 'TRAINER',
                // status: 1
            },
            {
                password: 0,
                type: 0,
                createdBy: 0,
                // status: 0
            })
            .then((info) => {
                res.json({
                    success: true,
                    message: `Success`,
                    data: info
                });
            }).catch((err) => {
                res.status(500).json({
                    success: false,
                    message: "Unable to fetch data"
                });
        });
    }
    else {
        res.status(401).json({
            success: false,
            message: "Permissions not granted!"
        });
    }
};

let getSingleTrainer = (req, res, next) => {
    req.body = sanitize(req.body);
    
    if(req.user.type==='ADMIN'){
        let _id = req.params._id;
        // console.log(_id);
        UserModel.find({
            _id: _id,
            // status: 1
        }, {
            password: 0,
            type: 0,
            createdBy: 0,
            // status: 0
        }).then((info) => {
            if(info.length === 0){
                res.json({
                    success: false,
                    message: `This account doesn't exist!`,
                
                });
            }
            else{
                res.json({
                    success : true,
                    message : `Success`,
                    data : info
                })

            }
        }).catch((err)=>{
            res.status(500).json({
                success: false,
                message: "Unable to fetch data"
            });
        })
    }
    else{
        res.status(401).json({
            success: false,
            message: "Permissions not granted!"
        });
    }    
};

module.exports = {
    trainerRegister,
    getAllTrainers,
    getSingleTrainer,
    removeTrainer
};
