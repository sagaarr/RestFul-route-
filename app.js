var bodyParser = require("body-parser"),
    express = require("express"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose"),
    expressSanitizer = require("express-sanitizer");
    
var app = express();

//APP CONFIG .......
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
mongoose.connect("mongodb://localhost/rest_ful_blog_app");

//MONGOOSE MODEL CONFIG.........

var BlogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{
              type:Date,
              default:Date.now
             }
});

var Blog = mongoose.model("Blog", BlogSchema);

// RESTFUL ROUTES................


app.get("/", function(req, res){
    res.redirect("/blog");
});



// INDEX ROUTE..............


app.get("/blog", function(req,res){
    
        Blog.find({}, function(err, blogs){
            if(err){
                res.send("Someting is wrong");
            }else{
                res.render("index", {blogs:blogs});
            }
        })
    });
    
    
//NEW ROUTE BLOG/NEW..............................


app.get("/blog/new", function(req, res){
    res.render("new");
});


// CREAT ROUTE ...............................


app.post("/blog", function(req, res){
    req.body.new.body = req.sanitize(req.body.new.body);
    //creat blog
    Blog.create(req.body.new, function(err, newBlog){
        if(err){
            res.render("new");
        }else{
            //Then, redirect to /blog with app.get....(index)
            res.redirect("/blog");
        }
    });
});

app.get("/blog/:id", function(req, res){
    Blog.findById(req.params.id, function(err, moreInfo){
        if(err){
            res.redirect("/blog");
        }else{
            res.render("show", {moreInfo: moreInfo});
        }
    });
});

app.get("/blog/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, editBlog){
        if(err){
            res.redirect("/blog");
        }else{
            res.render("edit", {editBlog:editBlog});
        }
    });
});

// UPDATE BLOG
app.put("/blog/:id", function(req, res){
    req.body.new.body = req.sanitize(req.body.new.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.editBlog, function(err, updatedBlog){
        if(err){
            res.redirect("/blog");
        }else{
            res.redirect("/blog/"+ req.params.id);
        }
    });
});

app.delete("/blog/:id", function(req, res){
    //destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blog");
        }else{
            res.redirect("/blog");
        }
    })
    //redirect 
});

app.listen(process.env.PORT,process.env.IP, function(){
    console.log("SERVER IS RUNNING!!!!!!!!!!!!!!!!!!");
})