const Products = require('../models/products');


module.exports = {
    create: function (req, res) {
        Products.create({
            name: req.body.name,
            price: req.body.price,
            mrp: req.body.mrp,
            stock: req.body.stock,
            isPublished: false
        }).then(product => {
            res.status(201).send(product.dataValues);
        })
    },

    getProducts: function (req, res) {
        Products.findAll().then(result => {

            let allProducts = [];
            result.map(r => {
                allProducts.push(r.dataValues);
            })

            res.status(200).send(allProducts);
        })
    },

    validate: function (req, res) {
        let id = req.params.id;

        Products.findByPk(id).then(result => {
            let product = result.dataValues;

            let errors = [];
            let c1 = product.mrp >= product.price;
            let c2 = product.stock > 0;

            if(!c1){
                errors.push("MRP should be less than equal to the Price");
            }

            if(!c2){
                errors.push("Stock count is 0");
            }

            if(c1 && c2){
                result.update({
                    isPublished: true
                }).then(r=>{
                    res.sendStatus(204);
                })

            }else {
                res.status(422).send(errors);
            }

        })
    },

    error: function (req, res) {
        res.sendStatus(405);
    }
}