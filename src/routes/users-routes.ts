import * as express from "express";

const router = express.Router();

router.get('/ping',(req, res)=>{
    return res.send('pong!')
})

router.get('/pong',(req, res)=>{
    return res.send('ping?')
})

export default router;
