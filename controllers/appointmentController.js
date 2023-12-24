const handleFactory = require("./handleFactory");
const appointmentModel = require("../models/appointmentModel");

exports.createAppointment = handleFactory.createOne(appointmentModel);
exports.updateAppointment = handleFactory.updateOne(appointmentModel);
exports.deleteAppointment = handleFactory.deleteOne(appointmentModel);
exports.getAppointment = handleFactory.getOne(appointmentModel);
exports.getAllAppointments = handleFactory.getAll(appointmentModel);
