const supabase = require("../supabase");
const bcrypt = require('bcrypt');

const serveSigninPage = (req, res) => {
  return res.send("Signin page. Please provide email and password.");
};

const serveSignupPage = (req, res) => {
  return res.send("Signup page. Please provide your details to register.");
};

const handleSignin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: "Invalid email or password" });
    } 
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.cookie("token", user.id, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
      sameSite: "Strict",
    });
    return res.status(200).json({ message: "Signed in successfully", token: user.id });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error", message: error.message });
  }
};

const handleLogout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out successfully" });
};

const handleSignup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "Please provide username, email, and password"
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
        message: "Please provide a valid email address"
      });
    }
    const { data: existingUsers, error: checkError } = await supabase
      .from("users")
      .select("email")
      .eq("email", email.toLowerCase());

    if (checkError) {
      console.error('Error checking existing user:', checkError);
      return res.status(500).json({
        error: "Database error",
        message: "Error checking existing user"
      });
    }

    // Check if any users were found with this email
    if (existingUsers && existingUsers.length > 0) {
      return res.status(400).json({
        error: "Email is already in use",
        message: "The email address you entered is already associated with an existing account."
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user object
    const newUser = {
      username: username,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "USER",
      created_at: new Date().toISOString()
    };

    console.log('Attempting to insert user:', { ...newUser, password: '[REDACTED]' });

    // Create user with hashed password
    const { data: insertData, error: insertError } = await supabase
      .from("users")
      .insert([newUser])
      .select('email, username, created_at');

    if (insertError) {
      console.error('Error creating user:', insertError);
      return res.status(500).json({
        error: "Failed to create user record",
        message: "An error occurred while creating your account"
      });
    }

    return res.status(201).json({
      message: "Signup successful. You can now sign in.",
      user: insertData[0]
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({
      error: "Failed to create user",
      message: "An unexpected error occurred. Please try again."
    });
  }
};

const getUserData = async (req, res) => {
  const {id} = req.params;

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("email, username, role, rating")
      .eq("id", id)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    res.json({ user });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch user data", message: error.message });
  }
};

module.exports = {
  serveSigninPage,
  serveSignupPage,
  handleSignin,
  handleSignup,
  handleLogout,
  getUserData,
};
