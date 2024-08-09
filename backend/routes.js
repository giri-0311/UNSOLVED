const express = require('express');
const router = express.Router();
const User = require('./models/User');
const Question = require('./models/Question');
const zod = require('zod');
const {userexists} = require("./middlewares/userexist.js")
const jwt = require("jsonwebtoken")
const {isUserSigned} = require("./middlewares/isusersigned.js")

const client_id = process.env.client_id;
const redirect_uri =  process.env.redirect_uri;
const authorization_endpoint = process.env.authorization_endpoint;

router.get('/loginwithgoogle', (req, res) => {
  const authUrl = `${authorization_endpoint}?response_type=code&client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}`;
  res.redirect(authUrl);
});

router.get('/callback', async (req, res) => {
  const authorization_code = req.query.code;
  
  if (!authorization_code) {
    return res.status(400).send('Authorization code is missing');
  }

  const token_endpoint = 'https://authorization-server.com/token';
  
  try {
    const response = await axios.post(token_endpoint, {
      grant_type: 'authorization_code',
      code: authorization_code,
      redirect_uri: redirect_uri,
      client_id: client_id,
      client_secret: 'your-client-secret'
    });
    
    const access_token = response.data.access_token;
    res.send(`Access token: ${access_token}`);
    
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    res.status(500).send('Error exchanging code for token');
  }
});



function arePasswordsEqual(password1, password2) {
    if (password1.length !== password2.length) {
        return false;
    }
    for (let i = 0; i < password1.length; i++) {
        if (password1[i] !== password2[i]) {
            return false;
        }
    }
    return true;
}

//signup checking using zod
const signupSchema = zod.object({
  email: zod.string().email(),
  username: zod.string().min(1),
  password: zod.string().min(6)
});

//signin checking using zod
const signinSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6)
});

//question checking using zod
const addQuestionSchema = zod.object({
    type: zod.string().min(1),
    question: zod.string().min(1),
    link: zod.string().min(1)
})

router.get('/', (req, res) => {
  res.send('Hello, World!');
});

router.post('/signup', userexists, async (req, res) => {
  const result = signupSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: 'Invalid inputs',
    });
  }

  const { email, username, password } = result.data;

  try {
    await User.create({
      email: email,
      username: username,
      password: password
    });

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(500).send('User creation failed');
    }
    const token = jwt.sign({ userId: user._id },process.env.JWT_SECRET_KEY);

    res.status(201).json({
      message: "User created successfully",
      token: token
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error (Database error)');
  }
});

router.post("/signin", async (req, res) => {
    const result = signinSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: 'Invalid email or password1',
        });
    }
    const { email, password } = result.data;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password2' });
        }
        //checking if passwords match 
        const isPasswordValid = arePasswordsEqual(password,user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password3' });
        }

        //generating a token and passing it to the frontend
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);
        res.status(200).json({ token , message:"User logged in successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post("/addQuestion", isUserSigned, async (req, res) => {
  const result = addQuestionSchema.safeParse(req.body);

  if (!result.success) {
      return res.status(400).json({
          message: 'Invalid question',
      });
  }

  const { question, type, link } = result.data;
  const user = req.user;

  try {
      // Check for duplicates
      const questionExistWithSameLink = await Question.findOne({ link: link, byuser: user._id });
      if (questionExistWithSameLink) {
          return res.status(400).json({ message: "Question with the same link already exists" });
      }

      const questionExistWithSameName = await Question.findOne({ question: question, byuser: user._id });
      if (questionExistWithSameName) {
          return res.status(400).json({ message: "Question with the same name already exists" });
      }

      // Create the question if no duplicates are found
      await Question.create({
          question: question,
          type: type,
          link: link,
          byuser: user._id
      });

      return res.status(201).json({
          message: "Question created successfully"
      });
  } catch (error) {
      console.error('Error creating question:', error);
      return res.status(500).json({ message: 'Internal Server Error (Database error)' });
  }
});


router.get("/getQuestions",isUserSigned, async (req,res)=>{
    const userid = req.user._id;
    try{
      const questions = await Question.find({byuser : userid});
      res.status(201).json({
        message: "Questions appear for this user",
        questions
      });
    }
    catch(error){
      res.status(500).send('Internal Server Error (Database error)');
    }
})

router.get("/getQuestions/:filter", isUserSigned, async (req, res) => {
  const userid = req.user._id;
  const filter = req.params.filter;
  try {
    const questions = await Question.find({ byuser: userid, type: filter });
    res.status(200).json({
      message: "Questions appear for this user",
      questions
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error (Database error)',
      error: error.message
    });
  }
});

router.get("/deleteQuestion/:id",isUserSigned, async(req,res)=>{
    const id = req.params.id;
    const userid = req.user._id;
    try{
      await Question.findOneAndDelete({byuser:userid , _id:id})
      res.status(200).json({
        "message":"Question deleted successfully"
      })
    }
    catch(error){ 
      res.status(500).send("Error in deleting Question")
    }
})

module.exports = router;
