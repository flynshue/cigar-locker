var express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    app = express();

var port = 3000;
mongoose.connect("mongodb://localhost:27017/cigar_locker", {useNewUrlParser: true, useUnifiedTopology: true});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

var cigarSchema = new mongoose.Schema({
    name: String,
    image: String,
    notes: String,
    rating: Number,
    created: {type: Date, default: Date.now}
});

var Cigar = mongoose.model("Cigar", cigarSchema);

// Cigar.create({
//     name: "Liga Privada Papas Fritas",
//     image: "https://www.cigarpage.com/media/catalog/product/cache/9/image/600x/9df78eab33525d08d6e5fb8d27136e95/k/b/kb-lps4544_1.jpg",
//     notes: "Petite corona, maduro, smooth, not too spicy",
//     rating: 5
// });

app.get("/", function(req, res){
    res.redirect("/cigars");
});

app.get("/cigars", function(req, res){
    Cigar.find({}, function(err, cigars){
        if(err){
            console.log("Error, could not find any cigars");
        } else{
            res.render("index", {cigars: cigars});
        }
    });
});

app.get("/cigars/new", function(req, res){
    res.render("new");
});

app.post("/cigars", function(req, res){
    var data = req.body.cigar;
    Cigar.create(data, function(err, newCigar){
        if(err){
            console.log(`Error could not add ${data} to database`);
        } else {
            console.log(`Successfully added ${newCigar}`);
            res.redirect("/cigars");
        }
    });
});

app.get("/cigars/:id", function(req, res){
    Cigar.findById(req.params.id, function(err, myCigar){
        if(err){
            console.log(`Error, could not find cigar in database`);
        } else {
            res.render("show", {cigar: myCigar});
        }
    });
});

app.get("/cigars/:id/edit", function(req, res){
    Cigar.findById(req.params.id, function(err, myCigar){
        if(err){
            console.log(`Could not find ${req.params.id} in database`);
        } else {
            res.render("edit", {cigar: myCigar});
        }
    });
});

app.put("/cigars/:id", function(req, res){
    var data = req.body.cigar;
    Cigar.findByIdAndUpdate(req.params.id, data, function(err, updatedCigar){
        if(err){
            console.log(`Error, failed to update cigar in database with ${data}`);
        } else {
            console.log(`Successfully added ${updatedCigar} to the database`);
            res.redirect("/cigars");
        }
    });
});

app.delete("/cigars/:id", function(req, res){
    Cigar.findByIdAndDelete(req.params.id, function(err){
        if(err){
            console.log(`Error deleting ${req.params.id} from database`);
        } else {
            console.log(`Successfully deteled ${req.params.id} from database`);
            res.redirect("/cigars");
        }
    });
});

app.listen(port, function(){
    console.log(`Cigar locker started on port: ${port}`);
});