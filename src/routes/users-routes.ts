import * as express from "express";
const router = express.Router();

export let usersRoutes = router.route('/').get((req, res)=>{
    return res.send('pong!')
})
