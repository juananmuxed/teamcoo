const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config();

const userScheme = mongoose.Schema({
    username:{
        type:String,
        required: [true,'Please include your name']
    },
    email:{
        type:String,
        required: [true,'Please include your e-mail']
    },
    password:{
        type:String,
        required: [true,'Please include a password']
    },
    firstname:{
        type:String,
        required: [true, 'Please include your First name']
    },
    lastname:{
        type:String,
        default:''
    },
    rol:{
        type:Object,
        default:{name:'User',value:'user'}
    },
    tokens:[{
        token:{
            type:String,
            required: true
        }
    }],
    accept:{
        termsconditions:{
            type:Boolean,
            required: [true, 'Please accept terms']
        },
        privacycookiepolicy:{
            type:Boolean,
            required: [true, 'Please accept policy']
        }
    },
    workgroups:{
        type: Array,
        default: []
    },
    unsuscribedworkgroups:{
        type: Array,
        default: []
    },
    verifiedemail:{
        type:Boolean,
        default: false
    },
    image:{
        type:String,
        default:''
    },
    membership:{
        type:Object,
        default:{status:'inactive'}
    },
    emailconfig:{
        type:Array,
        default:[]
    },
    privatecomments:{
        type:Array,
        default:[]
    }
});

userScheme.pre('save', async function(next) {
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8);
    }
    next();
});

userScheme.methods.generateAuthToken = function() {
    const user = this;
    const token = jwt.sign({_id:user._id,name:user.name,email:user.email}, process.env.SECRET_STRING);
    if(user.tokens.length < 5){
        user.tokens.shift()
    }
    user.tokens = user.tokens.concat({ token })
    user.save();
    return token;
};

userScheme.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error({ error: "Invalid mail" });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new Error({ error: "Invalid password" });
    }
    return user;
};
  
userScheme.statics.findByEmail = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error({ error: "Invalid mail" });
    }
    return user
}

userScheme.statics.findById = async (_id) => {
    const user = await User.findOne({ _id });
    if (!user) {
        throw new Error({ error: "Invalid id" });
    }
    return user
}

const User = mongoose.model("User", userScheme);
module.exports = User;