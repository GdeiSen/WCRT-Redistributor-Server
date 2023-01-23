import * as express from "express";
const router = express.Router();


let usersRoutes = router.get('/ping',(req, res)=>{
    return res.send('pong!')
})

router.use('/users', usersRoutes);

