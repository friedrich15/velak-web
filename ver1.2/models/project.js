var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    Photo = new Schema({
      name          : String,
      originalName  : String,
      fileSize      : Number,
      description   : String,
      position      : Number,
      filePath      : String,
      filePublic    : Boolean,
      deleted       : Boolean
    }),

    Audio = new Schema({
      name          : String,
      originalName  : String,
      fileSize      : Number,
      description   : String,
      position      : Number,
      filePath      : String,
      filePublic    : Boolean,
      deleted       : Boolean
    })

    Project = new Schema({
      position            : Number,
      name                : String,
      title               : String,
      description         : String,
      descriptionSource   : String,
      descriptionVersion  : [String],
      category            : String,
      photo               : [Photo],
      audio               : [Audio],
      photoLink           : String,
      visible             : Boolean,
      deleted             : Boolean
    });

    Doc = new Schema({
      name          : String,
      originalName  : String,
      fileType      : String,
      fileExtension : String,
      fileSize      : Number,
      description   : String,
      position      : Number,
      filePath      : String
    }),

    Post = new Schema({
      title               : String,
      position            : Number,
      name                : String,
      description         : String,
      descriptionSource   : String,
      descriptionVersion  : [String],
      category            : String,
      docs                : [Doc],
      visible             : Boolean,
      deleted             : Boolean
    });

mongoose.model('Post', Post);
mongoose.model('Doc', Doc);
mongoose.model('Project', Project);
mongoose.model('Photo', Photo);
mongoose.model('Audio', Audio);

mongoose.connect('mongodb://velakAdmin:asd0Admin@localhost/velakdb');
