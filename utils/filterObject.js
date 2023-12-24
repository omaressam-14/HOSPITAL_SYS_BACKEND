const filterObject = function (obj, ...exc) {
  const newObj = {};
  for (let [key, value] of Object.entries(obj)) {
    if (!exc.includes(key)) newObj[key] = value;
  }
  return newObj;
};

module.exports = filterObject;
