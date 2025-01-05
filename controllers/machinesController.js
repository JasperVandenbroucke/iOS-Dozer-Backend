const Joi = require("joi");
let machines_mock = require("../data/mock_data.json");

// GET ALL MACHINES
const getAllMachines = (req, res) => {
  let filteredMachines = machines_mock;

  if (req.query.searchText && req.query.searchText.trim() !== "") {
    const searchText = req.query.searchText.toLowerCase();
    filteredMachines = machines_mock.filter(
      (m) =>
        m.machineName.toLowerCase().includes(searchText) ||
        m.machineType.toLowerCase().includes(searchText)
    );
  }

  res.status(200).send(filteredMachines);
};

// GET MACHINE BY ID
const getMachineById = (req, res) => {
  if (!req.params.id) {
    res.status(400).send("Invalid machine id");
    return;
  }

  const machine = machines_mock.find((m) => m.id === parseInt(req.params.id));

  if (!machine) {
    res.status(404).send(`No machine with id ${req.params.id}`);
    return;
  }

  res.status(200).send(machine);
};

// GET MACHINES BY TYPE
const getMachinesByType = (req, res) => {
  if (!req.params.type) {
    res.status(400).send("Invalid machine type");
    return;
  }

  const machines = machines_mock.filter(
    (m) =>
      m.machineType.toLocaleLowerCase() === req.params.type.toLocaleLowerCase()
  );

  if (machines.length === 0) {
    res.status(404).send(`No machines with type ${req.params.type}`);
    return;
  }

  res.status(200).send(machines);
};

// CREATE MACHINE
const createMachine = (req, res) => {
  const { error } = validateMachine(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const newMachine = {
    id: machines_mock.map((m) => m.id).sort((a, b) => b - a)[0] + 1,
    machineName: req.body.machineName,
    machineType: req.body.machineType,
    basePrice: req.body.basePrice,
    options: req.body.options,
  };

  machines_mock.push(newMachine);

  res.status(201).send(newMachine);
};

// UPDATE MACHINE BY ID
const updateMachine = (req, res) => {
  const { id } = req.params;

  // Check the id
  if (!id) {
    res.status(400).send("Invalid machine id");
    console.log("⚠️ Invalid machine id");
    return;
  }

  // Validate the machineToUpdate
  const { error } = validateMachine(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    console.log(`⚠️ Error: ${error.details[0].message}`);
    return;
  }

  // Check if there is an existing machine
  const machineToUpdate = machines_mock.find((m) => m.id === parseInt(id));

  if (!machineToUpdate) {
    res.status(404).send(`No machine with id ${id}`);
    console.log(`⚠️ No machine with id ${id}`);
    return;
  }

  // Update the machine
  machineToUpdate.machineName = req.body.machineName;
  machineToUpdate.machineType = req.body.machineType;
  machineToUpdate.basePrice = req.body.basePrice;
  machineToUpdate.options = req.body.options;

  res.status(200).send(machineToUpdate);
};

// DELETE MACHINE BY ID
const deleteMachineById = (req, res) => {
  if (!req.params.id) {
    res.status(400).send("Invalid machine id");
    return;
  }

  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).send("Invalid machine id: not a number");
    return;
  }

  const machineIndex = machines_mock.findIndex((m) => m.id === id);

  if (machineIndex === -1) {
    res.status(404).send(`No machine with id ${id}`);
    return;
  }

  const [deletedMachine] = machines_mock.splice(machineIndex, 1);

  res.status(200).json(deletedMachine);
};

function validateMachine(machine) {
  const optionScheme = Joi.object({
    id: Joi.number().optional(),
    optionName: Joi.string().required(),
    price: Joi.number().required(),
  });

  const machineScheme = Joi.object({
    id: Joi.number().optional(),
    machineName: Joi.string().required(),
    machineType: Joi.string().required(),
    basePrice: Joi.number().required(),
    options: Joi.array().items(optionScheme),
  });

  return machineScheme.validate(machine);
}

module.exports = {
  getAllMachines,
  getMachineById,
  getMachinesByType,
  createMachine,
  updateMachine,
  deleteMachineById,
};
