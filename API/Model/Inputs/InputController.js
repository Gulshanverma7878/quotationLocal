const InputModel = require('./InputModel');
const NodeCache = require('node-cache');

const Inputcache = new NodeCache({ stdTTL: 600, checkperiod: 120 });//10 minutes


// Create and Save a new Input
exports.create = async (req, res) => {
    try {
        const input = await InputModel.create(req.body);
        await InvalidatedCache();
        res.status(200).json(input);
    } catch (error) {
        res.status(500).json(error);
    }
};  

exports.getAll = async (req, res) => {
    try {
        const cachedInputs = Inputcache.get("inputs");
        if (cachedInputs) {
            console.log("Cache hit");
            return res.status(200).json(cachedInputs);
        }
        console.log("Cache miss");
        const inputs = await InputModel.findAll();
        Inputcache.set("inputs", inputs);
        res.status(200).json(inputs);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Retrieve a single Input by id
exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const cachedInput = Inputcache.get(`input_id${id}`);
        if (cachedInput) {
            return res.status(200).json(cachedInput);
        }
        const input = await InputModel.findByPk(id);
        if (input) {
            await Inputcache.set(`input_id${id}`, input);
            res.status(200).json(input);
        } else {
            res.status(404).json({ message: 'Input not found' });
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

// Update an Input by id
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const [updatedRowsCount] = await InputModel.update(req.body, { where: { id } });
        if (updatedRowsCount > 0) {
            await InvalidatedCache();
            res.status(200).json({ message: 'Input updated successfully' });
        } else {
            res.status(404).json({ message: 'Input not found' });
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

// Delete an Input by id
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRowsCount = await InputModel.destroy({ where: { id } });
        if (deletedRowsCount > 0) {
            await InvalidatedCache();
            res.status(200).json({ message: 'Input deleted successfully' });
        } else {
            res.status(404).json({ message: 'Input not found' });
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

const  InvalidatedCache=async()=>{
    Inputcache.flushAll();
    console.log("Cache invalidated");
}