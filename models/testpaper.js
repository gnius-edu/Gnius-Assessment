const mongoose = require("mongoose");

const testschema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuestionModel',
        required: false
    }],
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubjectModel',
        required: false
    }],
    start: {
        type: String,
        required: true
    },
    end: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    organisation: {
        type: String,
        required: false
    },
    difficulty: {
        type: Number,
        default: 1,
        required: false
    },
    testbegins: {
        type: Boolean,
        default: false,
        required: true
    },
    status: {
        required: true,
        default: 1,
        type: Boolean
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    isRegistrationavailable: {
        type: Boolean,
        default: true,
        required: true
    },
    testconducted: {
        type: Boolean,
        default: false,
        required: true
    },
    isResultgenerated: {
        type: Boolean,
        default: false,
        required: true
    },
    addjobpost: Boolean,
    addcoding: Boolean
},
    { 
        timestamps: true 
    }
);

const TestPaperModel = mongoose.model(`TestPaperModel`,testschema);
module.exports=TestPaperModel;