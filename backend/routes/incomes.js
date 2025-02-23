const router = require("express").Router();
let Income = require("../models/income");

// Insert income
http://localhost:8020/income/add

router.route("/add").post((req, res) => {
    const title = req.body.title;
    const amount = Number(req.body.amount);
    const date = req.body.date;
    const other = req.body.other; 

    const newIncome = new Income({
        title,
        amount,
        date,
        other,
    });

    newIncome.save()
        .then(() => {
            res.json("Income Added");
        })
        .catch((err) => {
            console.log(err);
        });
});

// View income
router.route("/").get((req, res) => {
    Income.find()
        .then((income) => {
            res.json(income);
        })
        .catch((err) => {
            console.log(err);
        });
});

//View posts [additional]
router.get('/' , (req,res) =>{
    Income.find().exec((err,Income)=>{
        if(err){
            return res.status(400).json({
                error:err
            });
        }
        return res.status(200).json({
            success:true,
            existingPosts:Income
        })
    })
} )

// Update income
router.route("/update/:id").put(async (req, res) => {
    let incomeId = req.params.id;
    const { title, amount, date, other } = req.body;

    const updateIncome = {
        title,
        amount,
        date,
        other
    };

    try {
        const update = await Income.findByIdAndUpdate(incomeId, updateIncome);
        res.status(200).send({ status: "Income Updated"});
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error with updating income", error: err.message });
    }
});

// Delete income
router.route("/delete/:id").delete(async (req, res) => {
    let incomeId = req.params.id;

    try {
        await Income.findByIdAndDelete(incomeId);
        res.status(200).send({ status: "Income deleted" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ status: "Error with deleting income", error: err.message });
    }
});

// Get details using id
router.route("/get/:id").get(async (req, res) => {
    let incomeId = req.params.id;
    const income = await Income.findById(incomeId).then((income)=>{
        res.status(200).send({status: "Income fetched" , income})
    }).catch((err) => {
        console.log(err.message);
        res.status(500).send({status: "Error with fetching income" , error: err.message});
    }) 
})


// View income amounts
router.route("/amount").get((req, res) => {
    Income.find({}, { amount: 1, _id: 0 })
        .then((income) => {
            const incomeAmounts = income.map(income => income.amount);
            res.json(incomeAmounts);    
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Internal server error" });
        });
});


module.exports = router;
