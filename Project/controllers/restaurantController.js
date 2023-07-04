const Restaurant = require('../models/restaurantModel');

const addNewRestaurant = async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json(restaurant.toObject());
  } catch (err) {
    console.error('Failed to add new restaurant', err);
    res.status(500).json({ error: 'Failed to add new restaurant' });
  }
};

const getAllRestaurants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const borough = req.query.borough;
    const query = borough ? { borough } : {};
    const skip = (page - 1) * perPage;
    const restaurants = await Restaurant.find(query)
      .sort('restaurant_id')
      .skip(skip)
      .limit(perPage)
      .lean()
      .exec();
    res.json(restaurants);
  } catch (err) {
    console.error('Failed to retrieve restaurants', err);
    res.status(500).json({ error: 'Failed to retrieve restaurants' });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).lean().exec();
    if (restaurant) {
      res.json(restaurant);
    } else {
      throw new Error('Restaurant not found');
    }
  } catch (err) {
    console.error(
      `Failed to retrieve restaurant with ID ${req.params.id}`,
      err
    );
    res.status(404).json({ error: 'Restaurant not found' });
  }
};

const updateRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .lean()
      .exec();
    if (restaurant) {
      res.json(restaurant);
    } else {
      throw new Error('Restaurant not found');
    }
  } catch (err) {
    console.error(`Failed to update restaurant with ID ${req.params.id}`, err);
    res.status(404).json({ error: 'Restaurant not found' });
  }
};

const deleteRestaurantById = async (req, res) => {
  try {
    await Restaurant.findByIdAndDelete(req.params.id).exec();
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (err) {
    console.error(`Failed to delete restaurant with ID ${req.params.id}`, err);
    res.status(404).json({ error: 'Restaurant not found' });
  }
};

module.exports = {
  addNewRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurantById,
  deleteRestaurantById,
};
