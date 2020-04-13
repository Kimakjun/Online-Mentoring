const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env]
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);
db.Chat = require('./chat')(sequelize, Sequelize);
db.ChatRoom = require('./chatroom')(sequelize, Sequelize);
//db.User.hasMany(db.Post);


db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });


db.Post.belongsTo(db.User, { as : 'writer'});
db.Post.belongsTo(db.User, { as : 'applicant'});

db.User.belongsToMany(db.User, {
  foreignKey: 'MentorId',
  as: 'Mentees',
  through: 'Mentoring',

});
db.User.belongsToMany(db.User, {
  foreignKey: 'MenteeId',
  as: 'Mentors',
  through: 'Mentoring',
});


db.User.hasMany(db.Chat);
db.Chat.belongsTo(db.User);

db.ChatRoom.hasMany(db.Chat);
db.Chat.belongsTo(db.ChatRoom);




//   관계 
//   user(1) => chat(N)  
//   room(1) => user(N)
//   room(1) => chat(N)


module.exports = db;