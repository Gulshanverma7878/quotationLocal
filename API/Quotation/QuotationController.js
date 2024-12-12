const QuotationModel = require('./QuotationModel');

exports.Create = async (req, resp) => {
    try {

        var accessories = req.body.accessories;

        if (typeof accessories === 'string') {
            try {
                accessories = JSON.parse(accessories); // Parse the JSON string
                req.body.accessories=accessories;
                console.log('Parsed accessories:', accessories);
            } catch (error) {
                console.error('Invalid JSON string in accessories:', error.message);
            }
        }
        const addQuotation = await QuotationModel.create(req.body);
        if (addQuotation) {
            return resp.status(200).json(req.body);
        } else {
            return resp.status(500).json("not create ")
        }
    } catch (error) {
        return resp.status(500).json(error);
    }
}
exports.get = async (req, resp) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        let getQuotation = await QuotationModel.findAndCountAll({
            limit,
            offset,
        });
        getQuotation.rows.map((item) => {
            item.accessories = JSON.parse(item.accessories);
        });
        return resp.status(200).json({
            totalItems: getQuotation.count,
            totalPages: Math.ceil(getQuotation.count / limit),
            currentPage: page,
            data: getQuotation.rows
        });
    } catch (error) {
        console.log(error);
        return resp.status(500).json(error);
    }
}


exports.deleteQuotation = async (req, resp) => {
    try {
        const id = req.params.id;
        console.log(id);
        const delQuotation = await QuotationModel.destroy({
            where: {
                id
            }
        });
        if (delQuotation) {
            return resp.status(200).json("delete success");
        } else {
            return resp.status(400).json("not delete");
        }
    } catch (error) {
        return resp.status(500).json(error);
    }
}


exports.updateQuotation = async (req, resp) => {
    try {
        const id = req.params.id;
        const updateQuotation = await QuotationModel.update(req.body, {
            where: {
                id
            }
        });
        if (updateQuotation) {
            return resp.status(200).json("update success");
        } else {
            return resp.status(400).json("not update");
        }
    } catch (error) {
        return resp.status(500).json(error);
    }
}


