var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    Photo = new Schema({
      name          : String,
      originalName  : String,
      fileSize      : Number,
      description   : String,
      position      : Number,
      filePath      : String
    }),

    Audio = new Schema({
      name          : String,
      originalName  : String,
      fileSize      : Number,
      description   : String,
      position      : Number,
      filePath      : String
    })

    Project = new Schema({
      title               : String,
      position            : Number,
      name                : String,
      description         : String,
      descriptionSource   : String,
      descriptionVersion  : [String],
      category            : String,
      photo               : [Photo],
      audio               : [Audio],
      visible             : Boolean,
      deleted             : Boolean
    });

mongoose.model('Project', Project);
mongoose.model('Photo', Photo);
mongoose.model('Audio', Audio);

mongoose.connect('mongodb://velakAdmin:asd0Admin@localhost/velakdb');
