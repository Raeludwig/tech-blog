const router = require('express').Router();
const { Project, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const projectData = await Project.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    // Serialize data so the template can read it
    const projects = projectData.map((project) => project.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', {
      projects,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/project/:id', async (req, res) => {
  try {
    const projectData = await Project.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const project = projectData.get({ plain: true });

    res.render('project', {
      ...project,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});


router.get('/profile', async (req, res) => {
  try {
    const projectData = await Project.findAll({
      where: {
        user_id: req.session.user_id,
      },

      include: {
        model: User,
      },
    })
    const projects = projectData.map((project) => project.get({ plain: true }));
    console.log(projects)
    if (req.session.logged_in) {
      res.render('profile', { projects });
      return;
    }

    res.render('login');
  } catch (err) {
  
    res.status(500).json(err);
  }
});

router.get('/logout', (req, res) => {
  // Destroy the session to log out the user
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    // Redirect to the homepage after logging out
    res.redirect('/');
  });
});




module.exports = router;
