const AccessoriesModel=require('./AccessoriesModel');
const ModelNames=require('../ModelNames/modelName');

exports.CreateAccessories=async(req,res)=>{
    try {
        const {modelId,Accessories,price}=req.body;
        const modelname=await AccessoriesModel.create(req.body);
        console.log(modelname);
        res.status(200).json(modelname);
    } catch (error) {
        console.error('Error creating model name:', error);
        res.status(500).json({ error: 'Failed to create model name' });
    }
}
exports.getAllAccessoriess = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        
        const variants = await AccessoriesModel.findAndCountAll({
            include: [{
                model: ModelNames,
                as: 'modelnames'
            }],
            // raw: true,
            nest: false,
            limit,
            offset,
        });
        
        res.status(200).json({
            totalItems: variants.count,
            totalPages: Math.ceil(variants.count / limit),
            currentPage: page,
            data: variants.rows
        });
    } catch (error) {
        console.error('Error retrieving model names:', error);
        res.status(500).json({ error: 'Failed to retrieve model names' });
    }
};


exports.getByModelId = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        const variants = await AccessoriesModel.findAndCountAll({
            where: { modelId: id },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            limit,
            offset,
        });

        res.status(200).json({
            totalItems: variants.count,
            totalPages: Math.ceil(variants.count / limit),
            currentPage: page,
            data: variants.rows,
        });
    } catch (error) {
        console.error('Error retrieving variants:', error);
        res.status(500).json({ error: 'Failed to retrieve variants' });
    }
};




exports.deleteAccessories = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAccessories = await AccessoriesModel.destroy({ where: { id } });
        res.status(200).json(deletedAccessories);
    } catch (error) {
        console.error('Error deleting accessories:', error);
        res.status(500).json({ error: 'Failed to delete accessories' });
    }
};




exports.updateAccessories = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedAccessories = await AccessoriesModel.update(req.body, { where: { id } });
        res.status(200).json(updatedAccessories);
    } catch (error) {
        console.error('Error updating accessories:', error);
        res.status(500).json({ error: 'Failed to update accessories' });
    }
};
