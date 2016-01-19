var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    Photo = new Schema({
      name          : String,
      originalName  : String,
      fileSize      : Number,
      description   : String,
      relativeWidth     : Number,
      relativeHeight    : Number,
      position      : Number,
      filePath      : String,
      inProject     : String,
      filePublic    : Boolean,
      deleted       : Boolean
    }),

    Track = new Schema({
      name          : String,
      originalName  : String,
      fileSize      : Number,
      mp3tags       : Array,
      artist        : String,
      title         : String,
      position      : Number,
      fileExtension : String,
      fileType      : String,
      filePath      : String,
      filePublic    : Boolean,
      deleted       : Boolean
    })

    Project = new Schema({
      position            : Number,
      name                : String,
      title               : String,
      dateInput           : String,
      dateHtml            : String,
      date                : String,
      time                : String,
      imgdescription      : String,
      description         : String,
      descriptionSource   : String,
      descriptionVersion  : [String],
      category            : String,
      photo               : [Photo],
      audio               : [Track],
      photoLink           : String,
      pLinkRandom         : String,
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
      timestamp           : String,
      timeHtml            : String,
      visible             : Boolean,
      deleted             : Boolean
    });

mongoose.model('Post', Post);
mongoose.model('Doc', Doc);
mongoose.model('Project', Project);
mongoose.model('Photo', Photo);
mongoose.model('Track', Track);

mongoose.connect('mongodb://velakAdmin:asd0Admin@localhost/velakdb');
