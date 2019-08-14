const express = require('express');
const router = express.Router();
const Person = require('../models/person');
const jsonpatch = require('fast-json-patch');
const Change = require('../models/change');

router.get('/persons', async (req, res) => {
  const dbQuery = req.query.name ? { name: { $regex: new RegExp(`${req.query.name}`, 'i') } } : {};

  try {
    const data = await Person.find(dbQuery);

    res.json({ payload: data });
  } catch (error) {
    res.json({ error });
  }
});

router.post('/persons', async (req, res) => {
  const change = new Change({
    entityType: 'person',
    user: res.locals.user._id,
    changes: jsonpatch.compare({}, req.body)
  });

  await change.save();
  res.sendStatus(201);
});

router.get('/persons/changes', async (req, res) => {
  const changes = await Change.find({ entityType: 'person', approved: null }).populate('entity');

  res.json({ payload: changes });
});

router.put('/persons/changes/:changeId/approval', async (req, res) => {
  const change = await Change.findById(req.params.changeId).populate('entity');

  if (change.entity) {

  } else {
    const person = new Person(jsonpatch.applyPatch({}, change.changes).newDocument);

    change.approved = true;

    await Promise.all([person.save(), change.save()]);
  }

  /*
   * @todo request to the api
   * await change.save();
   */
  res.sendStatus(200);
});

router.put('/persons/:personId', async (req, res) => {
  const person = await Person.findById(req.params.personId);

  const clearedPersonData = JSON.parse(JSON.stringify(person));

  const changes = jsonpatch.compare(clearedPersonData, req.body);

  const change = new Change({
    entityType: 'person',
    user: res.locals.user._id,
    entity: req.params.personId,
    changes
  });

  await change.save();
  res.sendStatus(201);
});

router.get('/persons/:personId', async (req, res) => {
  const person = await Person.findById(req.params.personId);

  res.json({ payload: person });
});

module.exports = router;
