const departmentModel = require("../models/departmentModel");
const handleFactory = require("./handleFactory");

exports.getDepartment = handleFactory.getOne(departmentModel, {
  path: "doctors",
  select: "name photo age rating -department -__t",
});

exports.getAllDepartments = handleFactory.getAll(departmentModel);

exports.updateDepartment = handleFactory.updateOne(departmentModel);
exports.createDepartment = handleFactory.createOne(departmentModel);
exports.deleteDepartment = handleFactory.deleteOne(departmentModel);
