const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const url = "mongodb+srv://pratikjec22:772970@pratik.4ehct29.mongodb.net/?retryWrites=true&w=majority&appName=pratik";
mongoose.connect(url);

const donateSchema = {
    Name: String,
    email: String,
    amt: Number,
    total: {type:Number,default:0}
};

const Donation = mongoose.model("Donation", donateSchema);

// const addEntry = async (donarName, donarEmail, donarAmt) => {
//     try {
//         let donarEntry = await Donation.findOne({ email: donarEmail });

//         if (!donarEntry) {
//             let newEntry = new Donation({
//                 Name: donarName,
//                 email: donarEmail,
//                 amt: donarAmt,
//                 total: donarAmt
//             });
//             await newEntry.save();
//             return newEntry;
//         } else {
//             let newTotal = donarEntry.total + donarAmt;
//             await Donation.updateOne({ _id: donarEntry._id }, { $set: { total: newTotal, amt: donarAmt } });
//             return donarEntry;
//         }
//     } catch (err) {
//         throw err;
//     }
// };
const findEntry = async(email) =>{
    try{
    const entry = await Donation.findOne({email:email});
    return entry
    }
    catch(err)
    {
        console.log(err);
    }
}
const addEntry = async(name,email,donateAmt) =>{
    try{
        const newEntry = new Donation({
            Name:name,
            email:email,
            amt:donateAmt,
            total:donateAmt
        });
        await newEntry.save();
        return newEntry;
    }
    catch(err){
        console.log(err);
    }
}


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, resp) => {
    resp.render("home");
});

app.post("/donate", async (req, resp) => {
    let donarName = req.body.name;
    let email = req.body.email;
    let amt = parseFloat(req.body.donateAmt);
    try {
        const searchEntry = await findEntry(email);
        if(!searchEntry){
            const donarEntry = await addEntry(donarName, email, amt);
            await resp.render("success", { donarName: donarName ,amt:amt,total:amt,donarEmail:email});
        }
        else {
            let previousAmt =parseFloat(searchEntry.total); 
            let newTotal =parseFloat( previousAmt + amt);
            let id = searchEntry._id;
            await Donation.updateOne({_id:id},{ $set: { total: newTotal, amt: amt } });
            await resp.render("success", { donarName: donarName ,amt:amt,total:newTotal,donarEmail:email});
        }
        // console.log(donarInfo);
       
    } catch (err) {
        console.log(err);
        resp.render("home");
    }
});

app.get("/donate",(req,resp)  =>{
     resp.redirect('/');
}

) 

app.listen(3000, () => {
    console.log("Listening");
});
