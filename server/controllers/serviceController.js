const Service = require('../models/Service');

// GET /api/services — public, anyone can view active services
const getServices = async (req, res) => {
  try {
    const services = await Service.find({ status: 'active' });
    res.status(200).json({ success: true, message: 'Services fetched', data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch services', data: { error: error.message } });
  }
};

// GET /api/services/:id — public, single service detail
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found', data: {} });
    }
    res.status(200).json({ success: true, message: 'Service fetched', data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch service', data: { error: error.message } });
  }
};

// POST /api/services — admin only, create a new service
const createService = async (req, res) => {
  try {
    const { name, description, durationMinutes, price } = req.body;
    if (!name || !durationMinutes || price === undefined) {
      return res.status(400).json({ success: false, message: 'Name, duration, and price are required', data: {} });
    }
    const service = await Service.create({ name, description, durationMinutes, price });
    res.status(201).json({ success: true, message: 'Service created', data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create service', data: { error: error.message } });
  }
};

// PUT /api/services/:id — admin only, update a service
const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found', data: {} });
    }
    res.status(200).json({ success: true, message: 'Service updated', data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update service', data: { error: error.message } });
  }
};

// DELETE /api/services/:id — admin only, soft-delete by marking inactive
const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, { status: 'inactive' }, { new: true });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found', data: {} });
    }
    res.status(200).json({ success: true, message: 'Service deactivated', data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete service', data: { error: error.message } });
  }
};

module.exports = { getServices, getServiceById, createService, updateService, deleteService };
