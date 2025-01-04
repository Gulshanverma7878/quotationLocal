const ModelNames = require('./modelName.js');
// const AccessoriesModel=require('../Accessories/AccessoriesModel');
const InsuranceModel = require('../Insurance/InsuranceModel');
const VariantModel = require('../variants/variantModel');
const ColorModel = require('../colors/ColorModel');
const VASModel = require('../VAS/VASModel');
const xlsx = require('xlsx');
const AccessoriesModel = require('../Accessories/AccessoriesModel');
const NodeCache = require("node-cache");

const myCache = new NodeCache({ stdTTL: 600, checkperiod: 600 }); // 10 minutes cache 600 is equal to 10 minutes in seconds ttl is time to live 500 is equal to 8 minutes 20 seconds in seconds 
exports.CreateModelName = async (req, res) => {
    try {
        const { modelName, by, VC_Code, insurance_details } = req.body;

        // Check if the VC_Code already exists
        const ExistData = await ModelNames.findOne({ where: { VC_Code } });

        let modelname;

        if (ExistData) {
            modelname = await ModelNames.update(req.body, { where: { VC_Code } });
            var statusCode = 203;
        } else {
            modelname = await ModelNames.create(req.body);
            var statusCode = 200;
        }

        const insuranceDetails = JSON.parse(req.body.insurance_details);
        console.log(insuranceDetails);
        const Accessories = JSON.parse(req.body.Accessories);
        console.log(Accessories);

        if (insuranceDetails) {
            for (const [key, value] of Object.entries(insuranceDetails)) {
                if (!key.startsWith('insurance') || !value) continue;
                const index = key.match(/\d+/)?.[0];
                const priceKey = `price${index}`;
                const price = insuranceDetails[priceKey];

                if (!price) continue;
                const dataId = ExistData ? ExistData.id : modelname.id;

                const existingInsurance = await InsuranceModel.findOne({
                    where: { insurance_Name: value, modelId: dataId }
                });

                if (existingInsurance) {
                    await existingInsurance.update({ price });
                    console.log(`Updated insurance: ${value} with price: ${price}`);
                } else {
                    await InsuranceModel.create({
                        insurance_Name: value,
                        price,
                        modelId: dataId,
                    });
                    console.log(`Created new insurance: ${value} with price: ${price}`);
                }
            }
        }


        if (Accessories) {
            for (const [key, value] of Object.entries(Accessories)) {
                if (!key.startsWith('accessories_name') || !value) continue;
                const index = key.match(/\d+/)?.[0];
                const priceKey = `accessories_price${index}`;
                const price = Accessories[priceKey];

                if (!price) continue;
                const dataId = ExistData ? ExistData.id : modelname.id;

                const existingInsurance = await AccessoriesModel.findOne({
                    where: { accessories_name: value, modelId: dataId }
                });

                if (existingInsurance) {
                    await existingInsurance.update({ accessories_price: price });
                    console.log(`Updated insurance: ${value} with price: ${price}`);
                } else {
                    console.log("faasd")
                    console.log(modelname.id);
                    await AccessoriesModel.create({
                        accessories_name: value,
                        accessories_price: price,
                        modelId: dataId,
                    });
                    console.log(`Created new insurance: ${value} with price: ${price}`);
                }
            }
        }

        const VAS = JSON.parse(req.body.VAS_data);
        console.log("VAS");
        if (VAS) {
            console.log(VAS);
            for (const [key, value] of Object.entries(VAS)) {
                if (!key.startsWith('VAS_Name') || !value) continue;
                const index = key.match(/\d+/)?.[0];
                const priceKey = `VAS_price${index}`;
                const price = VAS[priceKey];
                console.log(value, price, "sdasf", modelname.id);

                if (!price) continue;
                const dataId = ExistData ? ExistData.id : modelname.id;

                const existingInsurance = await VASModel.findOne({
                    where: { VAS_Name: value, modelId: dataId }
                });

                if (existingInsurance) {
                    await existingInsurance.update({ VAS_price: price });
                    console.log(`Updated insurance: ${value} with price: ${price}`);
                } else {
                    console.log(value, price, modelname.id);
                    const VASADD = await VASModel.create({
                        VAS_Name: value,
                        VAS_price: price,
                        modelId: dataId,
                    });
                    console.log(VASADD);
                }
            }
        }
        await invalidateModelNamesCache();
        res.status(statusCode).json(modelname);
    } catch (error) {
        // If any error, rollback the transaction
        console.error('Error creating model name:', error);
        res.status(500).json({ error: 'Failed to create model name' });
    }
};


exports.getAllModelNames = async (req, res) => {
    try {

        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limitParam = req.query.limit;


        const limit = limitParam === 'ALL' ? null : Math.max(parseInt(limitParam) || 100, 1);
        const offset = limit ? (page - 1) * limit : null;


        const { rows: modelNames, count: totalItems } = await ModelNames.findAndCountAll({
            include: [
                { model: AccessoriesModel, as: 'accessories', attributes: ['id', 'accessories_name', 'accessories_price'] },
                { model: InsuranceModel, as: 'insurances', attributes: ['id', ['insurance_Name', 'insurance'], 'price'] },
                { model: VariantModel, as: 'variants', attributes: ['id', 'variant', 'price'] },
                { model: ColorModel, as: 'colors', attributes: ['id', 'color', 'price'] },
                { model: VASModel, as: 'vas', attributes: ['id', 'VAS_Name', 'VAS_price'] }
            ],
            limit,
            offset,
        });


        const count = await ModelNames.count();


        res.status(200).json({
            totalItems: count,
            totalPages: limitParam == "ALL" ? 1 : Math.ceil(count / limit),
            currentPage: page,
            data: modelNames,
        });
    } catch (error) {
        console.error('Error retrieving model names:', error);
        res.status(500).json({ error: 'Failed to retrieve model names' });
    }
};



exports.UpdateModel = async (req, res) => {
    try {
        const { id } = req.params;
        const modelname = await ModelNames.update(req.body, { where: { id } });
        await invalidateModelNamesCache();
        res.status(200).json(modelname);
    } catch (error) {
        console.error('Error updating model name:', error);
        res.status(500).json({ error: 'Failed to update model name' });
    }
}

exports.deleteModel = async (req, res) => {
    try {
        const { id } = req.params;
        const modelname = await ModelNames.destroy({ where: { id } });
        await invalidateModelNamesCache();
        res.status(200).json(modelname);
    } catch (error) {
        console.error('Error deleting model name:', error);
        res.status(500).json({ error: 'Failed to delete model name' });
    }
}


exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        if (myCache.has(`modelNamesPage_${id}`)) {
            console.log("Cache hit");
            return res.status(200).json(myCache.get(`modelNamesPage_${id}`));
        }
        console.log("Cache miss");
        const modelname = await ModelNames.findByPk(id, {
            include: [
                { model: AccessoriesModel, as: 'accessories', attributes: ['id', 'accessories_name', 'accessories_price'] },
                { model: InsuranceModel, as: 'insurances', attributes: ['id', 'insurance_Name', 'price'] },
                { model: VariantModel, as: 'variants', attributes: ['id', 'variant', 'price'] },
                { model: ColorModel, as: 'colors', attributes: ['id', 'color', 'price'] },
                { model: VASModel, as: 'vas', attributes: ['id', 'VAS_Name', 'VAS_price'] }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });
        if (!modelname) {
            return res.status(404).json({ error: 'Model name not found' });
        }
        const key = `modelNamesPage_${id}`;
        myCache.set(key, modelname);
        res.status(200).json(modelname);
    } catch (error) {
        console.error('Error retrieving model name:', error);
        res.status(500).json({ error: 'Failed to retrieve model name' });
    }
}

exports.getallDetail = async (req, res) => {
    try {
        const { id } = req.params;

        if (myCache.has(`modelNamesPage_${id}`)) {
            return res.status(200).json(myCache.get(`modelNamesPage_${id}`));
        }
        const modelname = await ModelNames.findAll({
            where: { id },
            include: [
                { model: AccessoriesModel, as: 'accessories', attributes: ['id', 'accessories_name', 'accessories_price'] },
                { model: InsuranceModel, as: 'insurances', attributes: ['id', 'insurance_Name', 'price'] },
                { model: VariantModel, as: 'variants', attributes: ['id', 'variant', 'price'] },
                { model: ColorModel, as: 'colors', attributes: ['id', 'color', 'price'] },
                { model: VASModel, as: 'vas', attributes: ['id', 'VAS_Name', 'VAS_price'] }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },

        });
        if (!modelname) {
            return res.status(404).json({ error: 'Model name not found' });
        }
        const key = `modelNamesPage_${id}`;
        const plainModelname = modelname.map((item) => item.get({ plain: true }));
        console.log(plainModelname);
        myCache.set(key, plainModelname);
        res.status(200).json(modelname);
    } catch (error) {
        console.error('Error retrieving model name:', error);
        res.status(500).json({ error: 'Failed to retrieve model name' });
    }
}

// exports.excel = async (req, res) => {
//     try {
//         let data;

//             console.log('Processing Excel file');
//             const file = req.files.excelFile;
//             const workbook = xlsx.read(file.data, { type: 'buffer' });
//             const sheetName = workbook.SheetNames[0];
//             const sheet = workbook.Sheets[sheetName];
//             data = xlsx.utils.sheet_to_json(sheet);

//         for (const item of data) {
//             const insuranceDetails = item.insurance_details || {};
//             const insuranceNames = [];
//             for (let i = 1; i <= 4; i++) { // Loop based on the number of insurance fields
//                 if (item[`insurance${i}`] && item[`price${i}`]) {
//                     insuranceNames.push({
//                         name: item[`insurance${i}`],
//                         price: item[`price${i}`],
//                     });
//                 }
//             }


//             const existingModel = await ModelNames.findOne({ where: { VC_Code: item.VC_Code } });

//             let model;
//             if (existingModel) {

//                 model = await existingModel.update(item);
//             } else {

//                 model = await ModelNames.create(item);
//             }

//             for (const ins of insuranceNames) {
//                 console.log(ins)
//                 const existingInsurance = await InsuranceModel.findOne({
//                     where: { insurance_Name: ins.name, modelId: model.id },
//                 });

//                 if (existingInsurance) {

//                     await existingInsurance.update({ price: ins.price });
//                 } else {

//                     await InsuranceModel.create({
//                         insurance_Name: ins.name,
//                         price: ins.price,
//                         modelId: model.id,
//                     });
//                 }
//             }
//         }

//         console.log('Data successfully processed');
//         res.status(200).json({ message: 'Data successfully processed.' });
//     } catch (error) {
//         console.error('Error processing data:', error.message, error.stack);
//         res.status(500).json({ error: 'Failed to process data.' });
//     }
// };



// exports.excel = async (req, res) => {
//     try {
//         let data;

//         console.log('Processing Excel file');
//         const file = req.files.excelFile;
//         const workbook = xlsx.read(file.data, { type: 'buffer' });
//         const sheetName = workbook.SheetNames[0];
//         const sheet = workbook.Sheets[sheetName];
//         data = xlsx.utils.sheet_to_json(sheet);

//         for (const item of data) {
//             const insuranceDetails = item.insurance_details || {};
//             const insuranceNames = [];
//             const VASDetails = item.VAS_details || {};
//             const VASNames = [];
//             const accessoriesDetails = item.accessories_details || {};
//             const accessoriesNames = [];

//             let length = Math.min(Object.keys(insuranceDetails).length / 2, 4);
//             console.log(length);
//             for (let i = 1; i <= 20; i++) {
//                 if (item[`insurance${i}`] && item[`price${i}`]) {
//                     insuranceNames.push({
//                         name: item[`insurance${i}`],
//                         price: item[`price${i}`],
//                     });
//                 }
//             }

//             length = Math.min(Object.keys(VASDetails).length / 2, 4);
//             for (let i = 1; i <= 20; i++) {
//                 if (item[`VAS_Name${i}`] && item[`VAS_price${i}`]) {
//                     VASNames.push({
//                         name: item[`VAS_Name${i}`],
//                         price: item[`VAS_price${i}`],
//                     });
//                 }
//             }

//             length = Math.min(Object.keys(accessoriesDetails).length / 2, 4);
//             for (let i = 1; i <= 20; i++) {
//                 if (item[`accessories_Name${i}`] && item[`accessories_price${i}`]) {
//                     accessoriesNames.push({
//                         name: item[`accessories_Name${i}`],
//                         price: item[`accessories_price${i}`],
//                     });
//                 }
//             }


//             console.log('Processing item:', item);
//             const existingModel = await ModelNames.findOne({ where: { VC_Code: item.VC_Code } });

//             let model;
//             if (existingModel) {
//                 model = await existingModel.update(item);
//             } else {
//                 model = await ModelNames.create(item);
//             }

//             // Handle bulk create or update for insurance
//             const existingInsuranceRecords = await InsuranceModel.findAll({
//                 where: { modelId: model.id },
//             });

//             const insuranceToUpdate = [];
//             const insuranceToCreate = [];

//             for (const ins of insuranceNames) {
//                 const existing = existingInsuranceRecords.find(record => record.insurance_Name === ins.name);
//                 if (existing) {
//                     insuranceToUpdate.push({
//                         id: existing.id,
//                         price: ins.price,
//                     });
//                 } else {
//                     insuranceToCreate.push({
//                         insurance_Name: ins.name,
//                         price: ins.price,
//                         modelId: model.id,
//                     });
//                 }
//             }

//             // Bulk create and update insurance
//             if (insuranceToCreate.length) {
//                 await InsuranceModel.bulkCreate(insuranceToCreate);
//             }
//             for (const ins of insuranceToUpdate) {
//                 await InsuranceModel.update(
//                     { price: ins.price },
//                     { where: { id: ins.id } }
//                 );
//             }

//             // Handle bulk create or update for VAS
//             const existingVASRecords = await VASModel.findAll({
//                 where: { modelId: model.id },
//             });

//             const VASToUpdate = [];
//             const VASToCreate = [];

//             for (const vas of VASNames) {
//                 const existing = existingVASRecords.find(record => record.VAS_Name === vas.name);
//                 if (existing) {
//                     VASToUpdate.push({
//                         id: existing.id,
//                         price: vas.price,
//                     });
//                 } else {
//                     VASToCreate.push({
//                         VAS_Name: vas.name,
//                         VAS_price: vas.price,
//                         modelId: model.id,
//                     });
//                 }
//             }

//             // Bulk create and update VAS
//             if (VASToCreate.length) {
//          const vas=       await VASModel.bulkCreate(VASToCreate);
//             console.log(vas)

//             }
//             for (const vas of VASToUpdate) {
//                 await VASModel.update(
//                     { VAS_price: vas.price },
//                     { where: { id: vas.id } }
//                 );
//             }

//             // Handle bulk create or update for Accessories

//         }

//         console.log('Data successfully processed');
//         res.status(200).json({ message: 'Data successfully processed.' });
//     } catch (error) {
//         console.error('Error processing data:', error.message, error.stack);
//         res.status(500).json({ error: 'Failed to process data.' });
//     }
// };




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
            const VASDetails = item.VAS_details || {};
            const VASNames = [];
            const accessoriesDetails = item.accessories_details || {};
            const accessoriesNames = [];

            for (let i = 1; i <= 20; i++) {
                if (item[`insurance${i}`] && item[`price${i}`]) {
                    insuranceNames.push({
                        name: item[`insurance${i}`],
                        price: item[`price${i}`],
                    });
                }

                if (item[`VAS_Name${i}`] && item[`VAS_price${i}`]) {
                    VASNames.push({
                        name: item[`VAS_Name${i}`],
                        price: item[`VAS_price${i}`],
                    });
                }

                if (item[`accessories_name${i}`] && item[`accessories_price${i}`]) {
                    accessoriesNames.push({
                        name: item[`accessories_name${i}`],
                        price: item[`accessories_price${i}`],
                    });
                }
            }

            console.log('Processing item:', item);
            const existingModel = await ModelNames.findOne({ where: { VC_Code: item.VC_Code } });

            let model;
            if (existingModel) {
                model = await existingModel.update(item);
            } else {
                model = await ModelNames.create(item);
            }

            // Handle bulk create or update for insurance
            const existingInsuranceRecords = await InsuranceModel.findAll({
                where: { modelId: model.id },
            });

            const insuranceToUpdate = [];
            const insuranceToCreate = [];

            for (const ins of insuranceNames) {
                const existing = existingInsuranceRecords.find(record => record.insurance_Name === ins.name);
                if (existing) {
                    insuranceToUpdate.push({
                        id: existing.id,
                        price: ins.price,
                    });
                } else {
                    insuranceToCreate.push({
                        insurance_Name: ins.name,
                        price: ins.price,
                        modelId: model.id,
                    });
                }
            }

            if (insuranceToCreate.length) {
                await InsuranceModel.bulkCreate(insuranceToCreate);
            }
            for (const ins of insuranceToUpdate) {
                await InsuranceModel.update(
                    { price: ins.price },
                    { where: { id: ins.id } }
                );
            }

            // Handle bulk create or update for VAS
            const existingVASRecords = await VASModel.findAll({
                where: { modelId: model.id },
            });

            const VASToUpdate = [];
            const VASToCreate = [];

            for (const vas of VASNames) {
                const existing = existingVASRecords.find(record => record.VAS_Name === vas.name);
                if (existing) {
                    VASToUpdate.push({
                        id: existing.id,
                        price: vas.price,
                    });
                } else {
                    VASToCreate.push({
                        VAS_Name: vas.name,
                        VAS_price: vas.price,
                        modelId: model.id,
                    });
                }
            }

            if (VASToCreate.length) {
                await VASModel.bulkCreate(VASToCreate);
            }
            for (const vas of VASToUpdate) {
                await VASModel.update(
                    { VAS_price: vas.price },
                    { where: { id: vas.id } }
                );
            }

            // Handle bulk create or update for Accessories
            const existingAccessoriesRecords = await AccessoriesModel.findAll({
                where: { modelId: model.id },
            });

            const accessoriesToUpdate = [];
            const accessoriesToCreate = [];

            for (const acc of accessoriesNames) {
                console.log(acc);
                const existing = existingAccessoriesRecords.find(record => record.accessories_Name === acc.name);
                if (existing) {
                    accessoriesToUpdate.push({
                        id: existing.id,
                        price: acc.price,
                    });
                } else {
                    accessoriesToCreate.push({
                        accessories_name: acc.name,
                        accessories_price: acc.price,
                        modelId: model.id,
                    });
                }
            }


            if (accessoriesToCreate.length) {
                console.log(accessoriesToCreate);
                await AccessoriesModel.bulkCreate(accessoriesToCreate);
            }
            for (const acc of accessoriesToUpdate) {
                await AccessoriesModel.update(
                    { accessories_price: acc.price },
                    { where: { id: acc.id } }
                );
            }
        }
        await invalidateModelNamesCache();
        console.log('Data successfully processed');
        res.status(200).json({ message: 'Data successfully processed.' });
    } catch (error) {
        console.log('Error processing data:', error);
        res.status(500).json({ error: 'Failed to process data.' });
    }
};


exports.getAllModelNamesCache = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limitParam = req.query.limit;


        const limit = limitParam === 'ALL' ? null : Math.max(parseInt(limitParam) || 100, 1);
        const offset = limit ? (page - 1) * limit : null;

        const cacheKey = `modelNamesPage_${page}_limit_${limit}`;


        const cachedData = myCache.get(cacheKey);
        if (cachedData) {
            console.log("Cache hit");
            return res.status(200).json({
                totalItems: cachedData.totalItems,
                totalPages: cachedData.totalPages,
                currentPage: cachedData.currentPage,
                data: cachedData.data,
            });
        }


        const { rows: modelNames, count: totalItems } = await ModelNames.findAndCountAll({
            include: [
                { model: AccessoriesModel, as: 'accessories', attributes: ['id', 'accessories_name', 'accessories_price'] },
                { model: InsuranceModel, as: 'insurances', attributes: ['id', ['insurance_Name', 'insurance'], 'price'] },
                { model: VariantModel, as: 'variants', attributes: ['id', 'variant', 'price'] },
                { model: ColorModel, as: 'colors', attributes: ['id', 'color', 'price'] },
                { model: VASModel, as: 'vas', attributes: ['id', 'VAS_Name', 'VAS_price'] }
            ],
            limit,
            offset,
        });

        const totalPages = limitParam === "ALL" ? 1 : Math.ceil(totalItems / limit);

        const responseData = {
            totalItems,
            totalPages,
            currentPage: page,
            data: modelNames.map(model => model.get({ plain: true })) // Convert Sequelize models to plain objects
        };

        myCache.set(cacheKey, responseData);

        console.log("Cache miss");
        return res.status(200).json(responseData);
    } catch (error) {
        console.error('Error retrieving model names:', error);
        res.status(500).json({ error: 'Failed to retrieve model names' });
    }
};

const invalidateModelNamesCache = async () => {
    const keys = myCache.keys();
    const keysToDelete = await keys.filter(key => key.startsWith('modelNamesPage_'));
    myCache.del(keysToDelete);
    const modelNamesGet = myCache.get("modelNamesGet");
    if (modelNamesGet) {
        myCache.del("modelNamesGet");
    }
    console.log('Cache invalidated:', keysToDelete);
};

exports.GetNames = async (req, resp) => {
    try {
        if (myCache.has("modelNamesGet")) {
            console.log("Cache hit");
            return resp.status(200).json(myCache.get("modelNamesGet"));
        }
        console.log("Cache miss");
        const data = await ModelNames.findAll({
            attributes: ['id', 'ppl']
        });
        myCache.set("modelNamesGet", data);
        resp.status(200).json(data);
    } catch (error) {
        resp.status(500).json({ error: 'Failed to retrieve model names' });
    }
}


exports.searchModel = async (req, res) => {
    try {
        const { name, columnName } = req.params;
        console.log(name, columnName);
        const modelname = await ModelNames.findAll({
            where: {
                [columnName]: name
            },
            attributes: ['id', 'ppl', 'VC_Code', 'variant', ['fuel_type', 'fuel']]
        });
        console.log(modelname);
        res.status(200).json(modelname);
    } catch (error) {
        console.error('Error retrieving model name:', error);
        res.status(500).json({ error: 'Failed to retrieve model name' });
    }
}

exports.searchColorByVariant = async (req, res) => {
    try {
        const variant = req.params.variant;
        const color= req.params.color;
        console.log(variant, color);
        const modelname = await ModelNames.findAll({
            where: {
                variant: variant,
                color: color
            },
        });
        console.log(modelname);
        res.status(200).json(modelname);
    } catch (error) {
        console.error('Error retrieving model name:', error);
        res.status(500).json({ error: 'Failed to retrieve model name' });
    }
}