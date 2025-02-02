// import express, { Request, Response } from 'express';
// import session from 'express-session';
// import dotenv from 'dotenv';
// import passport from './configs/auth';
// const router = express.Router();

// dotenv.config();

// const app = express();

// // Middleware
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || 'default_secret',
//     resave: false,
//     saveUninitialized: true,
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());

// // Routes
// app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// app.get(
//   '/auth/google/callback',
//   passport.authenticate('google', {
//     failureRedirect: '/login',
//     session: true,
//   }),
//   (req: Request, res: Response) => {
//     res.redirect('/dashboard');
//   }
// );

// app.get('/dashboard', (req: Request, res: Response) => {
//   if (req.isAuthenticated()) {
//     res.send(`Welcome ${(req.user as any).name}`);
//   } else {
//     res.redirect('/login');
//   }
// });

// router.get('/logout', (req: Request, res: Response) => {
//   req.logout((err) => {
//     if (err) return res.status(500).send(err);
//     res.redirect('/');
//   });
// });

// router.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));

// // Callback URL
// router.get(
//   "/auth/facebook/callback",
//   passport.authenticate("facebook", {
//     failureRedirect: "/login",
//     session: false, // if you're not using sessions
//   }),
//   (req, res) => {
//     // Generate token and send response
//     const user = req.user;
//     res.send(user);
//   }
// );

// router.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

// // Callback URL
// router.get(
//   "/auth/github/callback",
//   passport.authenticate("github", {
//     failureRedirect: "/login",
//     session: false,
//   }),
//   (req, res) => {
//     // Generate token and send response
//     const user = req.user;
//     res.send(user);
//   }
// );

// // Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });
