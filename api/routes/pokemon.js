const express = require('express');
const router = express.Router();
const userData = require('../models/userData');

// SIGN UP
router.post('/signup', async (req, res) => {
  console.log(req.body);
  let info = {
    userid: req.body.userid,
  };
  try {
    let result = await userData.find({ userid: req.body.userid });
    if (result.length === 0) {
      let result = await userData.create(info);
      res.send({
        exists: false,
        success: result,
      });
    } else {
      res.send({
        exists: true,
      });
    }
  } catch (error) {
    console.error(error);
  }
});

// EXISTENCE CHECK
router.post('/signin', async (req, res) => {
  // console.log(req.body);
  try {
    let result = await userData.find({ userid: req.body.userid });
    console.log(typeof result);
    if (result.length === 0) {
      res.send({
        exists: false,
      });
    } else {
      res.send({
        exists: true,
        info: result,
      });
    }
  } catch (error) {
    console.error(error);
  }
});

//Catch Pokemon by using energy!
router.post('/energize', async (req, res) => {
  // console.log(req.body);
  let id = req.body.id;
  let pokemonName = req.body.pokemonName;
  let energy = req.body.energy;
  // console.log(pokemonName);

  // check the user credits is it sufficient to catch the pokemon.
  try {
    let result = await userData.find({ userid: req.body.userid });
    // console.log(result);
    let _id = result[0]._id;
    let currentCredit = result[0].credits;

    if (currentCredit >= energy) {
      // balance
      const options = { new: true };
      currentCredit = currentCredit - energy;

      console.log(`Catch pokemon`);
      console.log(`Balance: ${currentCredit}`);
      const updates = {
        credits: currentCredit,
        $push: {
          pokemonCollection: { id: id, name: pokemonName },
        },
      };
      const upd = await userData.findByIdAndUpdate(_id, updates, options);
      console.log(upd);
      res.send({ captured: true, info: upd });
    } else {
      res.send({ captured: false });
    }
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
