const InputModel = require('./InputModel');
const NodeCache = require('node-cache');
const HPNListModel=require('./HPNList');


const Inputcache = new NodeCache({ stdTTL: 600, checkperiod: 120 });//10 minutes
const HPNCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });//10 minutes  

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


const  HPNInvalidatedCache=async()=>{
    HPNCache.flushAll();
    console.log("Cache invalidated");
}



// HPN list 

exports.createHPN = async (req, res) => {
    try {
        const hpn = await HPNListModel.create(req.body);
        await HPNInvalidatedCache();
        res.status(200).json(hpn);
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
};

exports.getAllHPN = async (req, res) => {
    try {
        console.log("Hello");
        const cachedHPN = HPNCache.get("hpns");
        if (cachedHPN) {
            console.log("Cache hit");
            return res.status(200).json(cachedHPN);
        }
        console.log("Cache miss");
        const hpns = await HPNListModel.findAll();
        HPNCache.set("hpns", hpns);
        res.status(200).json(hpns);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

// Retrieve a single HPN by id
exports.getByIdHPN = async (req, res) => {
    try {
        console.log("get by id");
        const { id } = req.params;
        const cachedHPN = HPNCache.get(`hpn_id${id}`);
        if (cachedHPN) {
            console.log("Cache hit");
            return res.status(200).json(cachedHPN);
        }
        const hpn = await HPNListModel.findByPk(id);
        if (hpn) {
            await HPNCache.set(`hpn_id${id}`, hpn);
            res.status(200).json(hpn);
        } else {
            res.status(404).json({ message: 'HPN not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

// Update an HPN by id
exports.updateHPN = async (req, res) => {
    try {
        const { id } = req.params;
        const [updatedRowsCount] = await HPNListModel.update(req.body, { where: { id } });
        if (updatedRowsCount > 0) {
            await HPNInvalidatedCache();
            res.status(200).json({ message: 'HPN updated successfully' });
        } else {
            res.status(404).json({ message: 'HPN not found' });
        }    
    } catch (error) {
        res.status(500).json(error);
    }
};

// Delete an HPN by id
exports.deleteHPN = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRowsCount = await HPNListModel.destroy({ where: { id } });
        if (deletedRowsCount > 0) {
            await HPNInvalidatedCache();
            res.status(200).json({ message: 'HPN deleted successfully' });
        } else {
            res.status(404).json({ message: 'HPN not found' });
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

