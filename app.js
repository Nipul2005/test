require('dotenv').config()


const express=require('express');
const app=express();
const path=require('path');
const cookie=require('cookie-parser')
const user_module=require('./model/model.js')
const bcrypt=require('bcryptjs')
const jwt =require('jsonwebtoken')
const posts=require('./model/post.js');
const upload=require('./config/uplaod.js')
const weekInMilliseconds = 7 * 24 * 60 * 60 * 1000; // 1 week

const cors = require('cors');
app.use(cors());
app.use('/uploads', express.static('uploads'));
const Port=process.env.PORT || 3000;

app.use(cookie())
app.set('view engine', 'ejs');

app.use(express.json())
app.use(express.urlencoded({extended: true})); 

app.use(express.static(path.join(__dirname, 'public')))

// middleware for user availabilty


 const verify= async(req, res, next)=>{

   if(Object.keys(req.cookies).length === 0){
        return res.redirect('/')
   }else{
        const cookie=req.cookies.Token;
        if(cookie){
          const decoded= jwt.verify(cookie, "gotit");

          if(decoded){
            const user=await user_module.findOne({email: decoded});
            if(user){
                res.cookie("message", 200, {maxAge: 30 * 1000, httpOnly: true})
                req.user_info=user;
                return next();
            }else{
                res.cookie("message", 401, {maxAge: 30 * 1000, httpOnly: true})
                
                return res.redirect('/')
            }
          }else{
            
            res.cookie("message", 401, {maxAge: 30 * 1000, httpOnly: true})
            return res.redirect('/')
           
          }
        }else{
            res.cookie("message", 401, {maxAge: 30 * 1000, httpOnly: true})
            return res.redirect('/');
        }
   }
  
}



app.get('/', async (req, res)=>{
    if(Object.keys(req.cookies).length ===0){
        return res.render('landing');
    }else{
        const cookie=req.cookies.Token;

        if(cookie){
            let decoder=null;
            try{
                decoder=jwt.verify(cookie, 'gotit')
            }catch(err){
                res.clearCookie('Token')
                return res.render('landing');
            }

            if(decoder){
                const user= await user_module.findOne({email: decoder});
                if(user){
                    return res.redirect(`/Home`)

                }else{
                    res.clearCookie('Token')
                    return res.render('landing');
                }
            }else{
                res.clearCookie('Token')
                return res.render('landing');
            }
        }else{
            res.clearCookie('Token')
            return res.render('landing');

        }
    }
})



app.get(`/Home`, verify, async(req, res)=>{
    res.render('index')
})


app.post('/signup', async (req, res)=>{
    const {name, email, password}=req.body;

    const present= await user_module.findOne({email})
   
    if(present) return res.status(300).json({message:300});
    try{
        const salt=await bcrypt.genSalt(10);
    const hash= await bcrypt.hash(password, salt)

   
   const user= await user_module.create({
        name,
        email,
        password: hash
    })

    let token=jwt.sign(email, 'gotit');
    res.cookie('Token', token, {maxAge: weekInMilliseconds, httpOnly: true, secure: false});
    return res.json({message: 200});
    }catch(err){
        res.json({message:401})
    }
    
})



app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const user = await user_module.findOne({ email: email });

    if (!user) {
        return res.json({ message: 401 });
    }
    else
    {

    const verify= await bcrypt.compare(password, user.password)

    if(email === user.email && verify){ 
        let token=jwt.sign(email, 'gotit');

        res.cookie('Token', token,{maxAge: weekInMilliseconds, httpOnly: true, secure: false});
        
        return res.status(200).json({message: 200})
    }
        else {return res.status(300).json({message:401})}

    }
    
  
});



app.post('/posts',verify,upload.single('attachment'), async(req,res)=>{

    try{
        const user=req.user_info;
        const {description}=req.body;
        const path=req.file.path.replace(/\\/g, '/').replace('public', '');  // Normalize path for frontend
        const Userpost= await posts.create({
            content: description,
            path,
            author: user._id
        })
    
        user.post.push(Userpost._id);
        await user.save()

        return res.json({message: 'Post has been Created', code: 200});
    }catch(err){
        return res.json({message: 'unable to create your post',code: 401});
    }
})

app.get('/posting', verify, async(req,res)=>{
    const user=req.user_info;
    const allpost= await posts.find();
    return res.json({allpost});
})


app.listen(Port)
