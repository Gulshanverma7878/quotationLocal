const ModelNames=require('./modelName.js');
const AccessoriesModel=require('../Accessories/AccessoriesModel');
const InsuranceModel=require('../Insurance/InsuranceModel');
const VariantModel=require('../variants/variantModel');
const ColorModel=require('../colors/ColorModel');
const VASModel=require('../VAS/VASModel');
const xlsx = require('xlsx');


exports.CreateModelName = async (req, res) => {
   
  
    try {
      const { modelName, by, VC_Code, insurance_details } = req.body;
  
      // Check if the VC_Code already exists
      const ExistData = await ModelNames.findAll({ where: { VC_Code } });
      
      let modelname;
      
      if (ExistData.length > 0) {
        modelname = await ModelNames.update(req.body, { where: { VC_Code }});
      } else {
        modelname = await ModelNames.create(req.body);

      }
  

      if (insurance_details) {
        for (const [key, value] of Object.entries(insurance_details)) {

            const existIns=await InsuranceModel.findOne({where:{key}});
            if(existIns){
                const update=await existIns.update()
            }



            console.log(key,value)
      const Ins=    await InsuranceModel.create({
            insurance_Name: key,  // insurance1, insurance2, etc.
            price: value,  // Corresponding prices for each insurance type
            modelId:modelname.id
          });
          console.log(Ins);

        }
      }

  
      // Return the modelname response
      res.status(200).json(modelname);
    } catch (error) {
      // If any error, rollback the transaction
      console.error('Error creating model name:', error);
      res.status(500).json({ error: 'Failed to create model name' });
    }
  };
  

exports.getAllModelNames = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        const modelNames = await ModelNames.findAndCountAll({
            limit,
            offset,
        });
        
        res.status(200).json({
            totalItems: modelNames.count,
            totalPages: Math.ceil(modelNames.count / limit),
            currentPage: page,
            data: modelNames.rows
        });
    } catch (error) {
        console.error('Error retrieving model names:', error);
        res.status(500).json({ error: 'Failed to retrieve model names' });
    }
}

exports.UpdateModel=async(req,res)=>{
    try {
        const {id}=req.params;
        const modelname=await ModelNames.update(req.body,{where:{id}});
        res.status(200).json(modelname);
    } catch (error) {
        console.error('Error updating model name:', error);
        res.status(500).json({ error: 'Failed to update model name' });
    }
}

exports.deleteModel=async(req,res)=>{
    try {
        const {id}=req.params;
        const modelname=await ModelNames.destroy({where:{id}});
        res.status(200).json(modelname);
    } catch (error) {
        console.error('Error deleting model name:', error);
        res.status(500).json({ error: 'Failed to delete model name' });
    }
}


exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const modelname = await ModelNames.findByPk(id);
        if (!modelname) {
            return res.status(404).json({ error: 'Model name not found' });
        }
        res.status(200).json(modelname);
    } catch (error) {
        console.error('Error retrieving model name:', error);
        res.status(500).json({ error: 'Failed to retrieve model name' });
    }
}

exports.getallDetail=async(req,res)=>{
    try {
        const {id}=req.params;
        const modelname=await ModelNames.findAll({where:{id},
            include:[
                {model:AccessoriesModel,as:'accessories',attributes:['id','AccessoryName','price']},
                {model:InsuranceModel,as:'insurances',attributes:['id','insurance_Name','price']},
                {model:VariantModel,as:'variants',attributes:['id','variant','price']},
                {model:ColorModel,as:'colors',attributes:['id','color','price']},
                {model:VASModel,as:'vas',attributes:['id','VAS_Name','price']}
            ],
            attributes:{
                exclude: ['createdAt', 'updatedAt']
            }
        });
        if (!modelname) {
            return res.status(404).json({ error: 'Model name not found' });
        }
        res.status(200).json(modelname);
    } catch (error) {
        console.error('Error retrieving model name:', error);
        res.status(500).json({ error: 'Failed to retrieve model name' });
    }
}

exports.excel = async (req, res) => {
    try {
        let data;
        
            console.log('Processing Excel file');
            const file = req.files.excelFile;
            const workbook = xlsx.read(file.data, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            data = xlsx.utils.sheet_to_json(sheet);
        
        for (const item of data) {
            const insuranceDetails = item.insurance_details || {};
            const insuranceNames = [];
            for (let i = 1; i <= 4; i++) { // Loop based on the number of insurance fields
                if (item[`insurance${i}`] && item[`price${i}`]) {
                    insuranceNames.push({
                        name: item[`insurance${i}`],
                        price: item[`price${i}`],
                    });
                }
            }

            
            const existingModel = await ModelNames.findOne({ where: { VC_Code: item.VC_Code } });

            let model;
            if (existingModel) {
                
                model = await existingModel.update(item);
            } else {
                
                model = await ModelNames.create(item);
            }
            
            for (const ins of insuranceNames) {
                console.log(ins)
                const existingInsurance = await InsuranceModel.findOne({
                    where: { insurance_Name: ins.name, modelId: model.id },
                });

                if (existingInsurance) {
                    
                    await existingInsurance.update({ price: ins.price });
                } else {
                    
                    await InsuranceModel.create({
                        insurance_Name: ins.name,
                        price: ins.price,
                        modelId: model.id,
                    });
                }
            }
        }

        console.log('Data successfully processed');
        res.status(200).json({ message: 'Data successfully processed.' });
    } catch (error) {
        console.error('Error processing data:', error.message, error.stack);
        res.status(500).json({ error: 'Failed to process data.' });
    }
};



