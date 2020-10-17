const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');

const Memo = require('../models/Memo');

//@desc Show add memo page
//@route GET /memos/add
router.get('/add', ensureAuth, (req, res) => res.render('memos/add'));

//@desc Process add form
//@route POST /memos
router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Memo.create(req.body);
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

//@desc Show all memos
//@route GET /memos
router.get('/', ensureAuth, async (req, res) => {
  try {
    const memos = await Memo.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean();
    res.render('memos/index', {
      memos,
    });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

//@desc Show single memo page
//@route GET /memos/:id
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let memo = await Memo.findById(req.params.id).populate('user').lean();

    if (!memo) {
      return res.render('error/404');
    } else {
      res.render('memos/show', {
        memo,
      });
    }
  } catch (err) {
    console.error(err);
    res.render('error/404');
  }
});

//@desc Show edit page
//@route GET /memos/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const memo = await Memo.findOne({
      _id: req.params.id,
    }).lean();

    if (!memo) {
      return res.render('error/404');
    }

    if (memo.user != req.user.id) {
      res.redirect('/memos');
    } else {
      res.render('memos/edit', {
        memo,
      });
    }
  } catch (err) {
    console.error(err);
    return res.render('error/500');
  }
});

//@desc Update memo
//@route PUT /memos/:id
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let memo = await Memo.findById(req.params.id).lean();

    if (!memo) {
      return res.render('error/404');
    }

    if (memo.user != req.user.id) {
      res.redirect('/memos');
    } else {
      memo = await Memo.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });
      res.redirect('/dashboard');
    }
  } catch (err) {
    console.error(err);
    return res.render('error/500');
  }
});

//@desc Delete memo
//@route DELETE /memos/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    await Memo.remove({ _id: req.params.id });
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    return res.render('error/500');
  }
});

//@desc Show user memos
//@route GET /memos/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const memos = await Memo.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean();

    res.render('memos/index', {
      memos,
    });
  } catch (err) {
    console.error(err);
    return res.render('error/404');
  }
});

module.exports = router;
