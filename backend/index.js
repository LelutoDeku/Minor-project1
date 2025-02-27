import express from 'express'
import routes from './routes/routes.js'
import {fileURLToPath} from 'url'
import path from 'path'
import multer from 'multer'

const app=express()
const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)
const storage=multer.memoryStorage()
const upload = multer({ storage: storage })

app.use(express.json())
app.use('/',routes)
app.use(express.static(path.join(__dirname,'../frontend')))

app.listen(4000,()=>{
    console.log('Server running at 4000')
})