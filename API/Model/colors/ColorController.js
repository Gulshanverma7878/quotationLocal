const ColorModel=require('./ColorModel');
const ModelNames=require('../ModelNames/modelName');

exports.CreateColor=async(req,res)=>{
    try {
        const {modelId,Color,price,variantId}=req.body;
        const modelname=await ColorModel.create(req.body);
        console.log(modelname);
        res.status(200).json(modelname);
    } catch (error) {
        console.error('Error creating model name:', error);
        res.status(500).json({ error: 'Failed to create model name' });
    }
}
exports.getAllColors = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        
        const variants = await ColorModel.findAndCountAll({
            include: [{
                model: ModelNames,
                as: 'modelnames',
                attributes: ['id', 'modelName','price']
            }
        ],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            // raw: true,
            // nest: false,
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
        const variants = await ColorModel.findAndCountAll({
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


exports.UpdateColor=async(req,res)=>{
    try {
        const {id}=req.params;
        const color=await ColorModel.update(req.body,{where:{id}});
        res.status(200).json(color);
    } catch (error) {
        console.error('Error updating color:', error);
        res.status(500).json({ error: 'Failed to update color' });
    }
}



exports.deleteColor=async(req,res)=>{
    try {
        const {id}=req.params;
        const deletedcolor=await ColorModel.destroy({where:{id}});
        res.status(200).json(deletedcolor);
    } catch (error) {
        console.error('Error deleting color:', error);
        res.status(500).json({ error: 'Failed to delete color' });
    }
}


exports.getByVariantId=async(req,res)=>{
    try {
        const {id}=req.params;
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        const colors = await ColorModel.findAndCountAll({
            where: { variantId: id },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            limit,
            offset,
        });

        res.status(200).json({
            totalItems: colors.count,
            totalPages: Math.ceil(colors.count / limit),
            currentPage: page,
            data: colors.rows,
        });
    } catch (error) {
        console.error('Error retrieving colors:', error);
        res.status(500).json({ error: 'Failed to retrieve colors' });
    }
}
