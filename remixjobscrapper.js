var express=require('express');
var session=require('cookie-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Job = require('./models/job');
var remixjobs = require('remixjobs');


mongoose.connect("mongodb://localhost:27017");

var app = express();

app.use(session({
  secret:'scraper'
}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
//ROUTES FOR API
var router = express.Router();

router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');

    next(); // make sure we go to the next routes and don't stop here
});


router.get('/',function(req,res){
  res.json({message:"hooray"});
});

//BASE SETUP OF MODEL
router.route('/jobs')

  .post(function(req,res){
    var job = new Job();
    if(req.body.title)job.title=req.body.title;
    if(req.body.company)job.company=req.body.company;
    if(req.body.localization)job.localization= req.body.localization;
    if(req.body.category)job.category= req.body.category;
    if(req.body.description)job.description = req.body.description;
    if(req.body.contract)job.contract = req.body.contract;
    if(req.body.date)job.date = new Date(req.body.date);
    fillMyTags(['yolo','swagg','tracks'],job.tags);

    job.save(function(err){
      if(err)res.send(err);
    });
    res.json({message:"Job created !"});
  })
  .get(function(req, res) {
        Job.find(function(err, Jobs) {
            if (err)
                res.send(err);
            res.json(Jobs);
        });
    });
router.route('/jobs/latest')
    .get(function(req,res){
    });
router.route('/jobs/:Job_id')

      .put(function(req,res){
        Job.findById(req.params.Job_id,function(err,Job){
          if(err){
            res.send(err);
                  }

        if(req.body.title)Job.title=req.body.title;
        if(req.body.company)Job.company=req.body.company;
        if(req.body.localization)Job.localization= req.body.localization;
        if(req.body.category)Job.category= req.body.category;
        if(req.body.description)Job.description = req.body.description;
        if(req.body.contract)Job.contract = req.body.contract;
        if(req.body.date)Job.date =new Date(req.body.date);
        if(req.body.tag)Job.tags = tags.push(req.body.tags);

        Job.save(function(err){
          if(err)res.send(err);
          res.json({message:"Job name updated"});

          });
        });
      })
      .get(function(req,res){
        Job.findById(req.params.Job_id,function(err,Job){
          if(err)res.send(err);
          res.json(Job);
        });
      })
      .delete(function(req,res){
        Job.remove({
          _id:req.params.Job_id},function(err,Job){
            if(err)res.send(err);
            res.json({message:"Job successfully deleted"});
          });
        });
//ROUTES FOR REMIXJOBSCRAPPING
router.route('/scrap').
  get(remixjobs.scrapAllJobs);

//REGISTER ROUTES
app.use('/api',router);
app.listen(8080);

//utils function
function fillMyTags(_arrayOfTags,_arrayToFill){
    for(i=0;i<_arrayOfTags.length;i++){
    _arrayToFill.push(_arrayOfTags[i]);
    }
}
