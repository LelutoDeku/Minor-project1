import express from 'express'
import path from 'path'
import {fileURLToPath} from 'url'
import multer from 'multer'
import mongoose from 'mongoose'
import {register} from './schema.js'
import bcrypt from 'bcrypt'

const app=express()
const router=express.Router()
const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)
const storage=multer.memoryStorage()     //creates in memory storage engine
const upload = multer({ storage: storage })


mongoose.connect("mongodb://127.0.0.1:27017/Minordb" ).then(() =>{console.log("connected to database successfully")}).catch((error)=> {console.log("error in connecting to database" , error)})

app.use(express.json())

router.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'../../frontend/Signin.html'))
})

router.get('/signup',(req,res)=>{
    res.sendFile(path.join(__dirname,'../../frontend/Signup.html'))
})

router.get('/homebuyer',(req,res) =>{
    res.sendFile(path.join(__dirname,`../../frontend/homepagebuyers.html`))
})

router.get('/about',(req,res) =>{
    res.sendFile(path.join(__dirname,'../../frontend/About.html'))
})

router.get('/sell',(req,res) =>{
    res.sendFile(path.join(__dirname,'../../frontend/Sellerlandingpage.html'))
})

router.post('/selldata', upload.single('image') , (req,res) =>{   //need to update
    const selldata=req.body
    const image=req.file.buffer  //encrption tyrp=
    console.log(image)
    // console.log(selldata)
    res.send('Data received')
})

router.post('/submit', async(req,res) =>{
    const userData=req.body
    console.log(userData)
    const verifyemail=userData.email

    const existing_user=await register.findOne({email:verifyemail})

    if(existing_user){
        console.log('email already exists')
        res.send("Email already exists, Signin")
        return
    }

    const newuserdata=new register({
        name:userData.name,
        email:userData.email,
        password:userData.password
    })

    await newuserdata.save().then(() => console.log('User registered')).catch(() => console.log("error registering"))

    res.send('Data received and user registered')
})

router.post('/authenticatebuyer', async(req,res) =>{
    const authenticate=req.body
    // console.log(authenticate)

    const check_email=authenticate.email
    const verify_password=authenticate.password

    const verify_email = await register.findOne({email:check_email})


    if(!verify_email){
        res.status(400).send("Wrong E-mail or Password")
        return
    }
    else{

    // const check_password=await bcrypt.compare(verify_password, verify_email.password)

   if(verify_password === verify_email.password){
    // res.status=200
    res.status(200).send('Successful Buyer')
    return
   }
   else{
    console.log("Wrong e-mail or password")
    res.status(400).send("Wrong e-mail or password")
    return 
   }
}
})

router.post('/authenticateseller', async(req,res) =>{
    const authenticate=req.body
    // console.log(authenticate)
    
    const check_email=authenticate.email
    const verify_password=authenticate.password
    
    const verify_email = await register.findOne({email:check_email})

    if(!verify_email){
        res.status(400).send("Wrong E-mail or Password")
        return
    }
    else{

    // const check_password=await bcrypt.compare(verify_password, verify_email.password)

    // console.log(check_password)

   if(verify_password === verify_email.password){
    res.status(200).send('Successful Seller')
    return
   }
   else{
    console.log("Wrong e-mail or password")
    res.status(400).send("Wrong e-mail or password")
    return
   }
}
})

router.get('/search', (req,res) =>{
    const search=decodeURIComponent(req.query.q)
    console.log(search)
    res.send("Looks good")
})


export default router
