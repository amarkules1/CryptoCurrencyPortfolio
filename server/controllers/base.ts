abstract class BaseCtrl {

  abstract model: any;

  // Get all
  getAll = (req, res) => {
    this.model.find({}, (err, docs) => {
      if (err) { return console.error(err); }
      res.status(200).json(docs);
    });
  }
  //get all matching
  
  getAllMatching = (req, res) => {
    this.model.find({}, (err, docs) => {
      if (err) { return console.error(err); }
      res.status(200).json(docs);
    });
  }
  
  // Count all
  count = (req, res) => {
    this.model.count((err, count) => {
      if (err) { return console.error(err); }
      res.status(200).json(count);
    });
  }

  // Insert
  insert = (req, res) => {
    const obj = new this.model(req.body);
    obj.save((err, item) => {
      // 11000 is the code for duplicate key error
      if (err && err.code === 11000) {
        res.sendStatus(400);
      }
      if (err) {
        return console.error(err);
      }
      res.status(200).json(item);
    });
  }

  // Get by id
  get = (req, res) => {
    this.model.findOne({ _id: req.params.id }, (err, item) => {
      if (err) { return console.error(err); }
      res.status(200).json(item);
    });
  }

  //get by username
  getByName = (req, res) => {
    this.model.findOne({ username: req.params.id }, (err, item) => {
      if (err) { return console.error(err); }
      res.status(200).json(item);
    });
  }
  
  getByUName = (req, res) => {
    this.model.find({ user: req.params.id }, (err, item) => {
      if (err) { return console.error(err); }
      res.status(200).json(item);
    });
  }

  getPrice = (req, res) => {
    const https = require('https');
    https.get('https://min-api.cryptocompare.com/data/price?fsym=' + req.params.id + '&tsyms=USD', resp => {
      let data = '';
      resp.on('data', (chunk) => { data += chunk; });
      resp.on('end', () => {
        data = JSON.parse(data);
        data['index'] = req.params.index;
        console.log(data);
        res.status(200).json(data);
      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
  }

    getMovingAve = (req, res) => {
    const https = require('https');
    https.get('https://min-api.cryptocompare.com/data/histoday?fsym=' + req.params.id + '&tsym=USD&limit=30&aggregate=1&e=CCCAGG', resp => {
      let data = '';
      resp.on('data', (chunk) => { data += chunk; });
      resp.on('end', () => {
        data = JSON.parse(data);
        let mAve = 0;
        let i = 0;
        for (i = 0; i < 30;i++){
          mAve += data['Data'][i]['close'];
        }
        mAve = (mAve / 30);
        let response = {
          movingAve: mAve,
          index: req.params.index
        };
        //console.log(data);
        res.status(200).json(response);
      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
  }

  // Update by id
  update = (req, res) => {
    this.model.findOneAndUpdate({ _id: req.params.id }, req.body, (err) => {
      if (err) { return console.error(err); }
      res.sendStatus(200);
    });
  }

  // Delete by id
  delete = (req, res) => {
    this.model.findOneAndRemove({ _id: req.params.id }, (err) => {
      if (err) { return console.error(err); }
      res.sendStatus(200);
    });
  }
}

export default BaseCtrl;
