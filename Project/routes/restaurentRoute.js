const express = require('express');
const router = express.Router();
const restaurantDb = require('../models/restaurantModel');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

router.get('/get-all-restaurants', async function getAllRestaurants(req, res) {
  try {
    const queryParams = req.query;
    const perPage = Math.ceil(parseInt(queryParams.perPage)) || 5;
    const page = Math.ceil(parseInt(queryParams.page)) || 1;
    const borough = queryParams.borough;
    const skip = perPage * page - perPage;
    const query = borough ? { borough: borough } : {};
    const totalEntries = await restaurantDb.find({}).countDocuments();
    const totalPages = Math.ceil(totalEntries / perPage);
    if (page > totalPages)
      return res
        .status(400)
        .send({ data: {}, msg: 'Page number exceeds maximum pages' });
    const data = await restaurantDb
      .find(query)
      .skip(skip)
      .limit(perPage)
      .sort({ restaurant_id: 1 });
    let dataToSend = [];
    dataToSend.push(data);
    return res
      .status(200)
      .send({ data: data, msg: 'Restaurants fetched successfully.' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ data: null, msg: 'Something went wrong.' });
  }
});

router.get('/get-restaurant/:id', async function getRestaurantById(req, res) {
  try {
    const data = await restaurantDb.findOne({ _id: ObjectId(req.params.id) });
    if (!data)
      return res.status(400).send({ data: {}, msg: 'No Restaurant found' });
    return res
      .status(200)
      .send({ data: data, msg: 'Restaurant fetched successfully.' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ data: null, msg: 'Something went wrong.' });
  }
});

router.post('/add-restaurant', async function addRestaurant(req, res) {
  try {
    const { name, borough, cuisine, address, grades, restaurant_id } = req.body;
    const isExisting = await restaurantDb.findOne({
      restaurant_id: restaurant_id,
    });
    if (isExisting)
      return res
        .status(400)
        .send({ data: {}, msg: 'Restaurant with same id already exists.' });
    const data = {
      name: name,
      borough: borough,
      cuisine: cuisine,
      address: {
        building: address.building,
        coord: address.coord,
        street: address.street,
        zipcode: address.zipcode,
      },
      grades: grades,
      restaurant_id: restaurant_id,
    };
    await restaurantDb.create(data);
    return res
      .status(201)
      .send({ data: data, msg: 'New restaurant added successfully.' });
  } catch (error) {
    return res.status(500).send({ data: null, msg: 'Something went wrong.' });
  }
});

router.put('/update-restaurant/:id', async function updateRestaurant(req, res) {
  try {
    const { name, borough, cuisine, address, grades } = req.body;
    const data = await restaurantDb.findOne({ _id: ObjectId(req.params.id) });
    if (!data)
      return res.status(400).send({ data: {}, msg: 'No Restaurant found' });
    const updatedData = {
      name: name,
      borough: borough,
      cuisine: cuisine,
      address: {
        building: address.building,
        coord: address.coord,
        street: address.street,
        zipcode: address.zipcode,
      },
      grades: grades,
    };
    await restaurantDb.findOneAndUpdate(
      { _id: ObjectId(req.params.id) },
      updatedData
    );
    return res.status(200).send({
      data: updatedData,
      msg: 'Restaurant details updated successfully.',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ data: null, msg: 'Something went wrong.' });
  }
});

router.delete(
  '/delete-restaurant/:id',
  async function deleteRestaurant(req, res) {
    try {
      let restaurant = await restaurantDb.findOne({
        _id: ObjectId(req.params.id),
      });
      if (!restaurant)
        return res.status(400).send({ data: {}, msg: 'No Restaurant found' });
      await restaurantDb.findByIdAndDelete({ _id: req.params.id });
      return res
        .status(200)
        .send({ data: {}, msg: 'Restaurant deleted successfully.' });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ data: null, msg: 'Something went wrong.' });
    }
  }
);

module.exports = router;
