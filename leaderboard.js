// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Meteor.Collection("players");

if (Meteor.isClient) {
  Meteor.startup(function () {
    Session.set("order", {score: -1, name: 1});
  });

  Template.leaderboard.players = function () {
   return Players.find({}, {sort: Session.get("order")});
  };

  Template.leaderboard.selected_name = function () {
    var player = Players.findOne(Session.get("selected_player"));
    return player && player.name;
  };

  Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };

  Template.leaderboard.events({
    'click input.inc': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 5}});
    },
    'click input.sort': function() {
      var currentOrder = Session.get("order");

      if (Object.keys(currentOrder)[0] == "score"){
        Session.set("order", {name: 1, score: -1});
      }else{
        Session.set("order", {score: -1, name: 1});
      };
    },

    'click input.random' : function(){
      Players.find({}).forEach(function(player){
        Players.update( {_id: player._id}, { $set: { score: Math.floor(Random.fraction()*10)*5}});
      });
    },
  });

  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
    }
  });

  Template.new_player.events({
    'click input.add': function(){
      var name = $('#name').val();
      Players.insert({name: name, score: Math.floor(Random.fraction()*10)*5});
      $('#name').val('');
    },

    'click input.remove': function(){
      Players.remove({_id: Session.get("selected_player")});
    }
  });
}

// On server startup, create some players if the database is empty.
// if (Meteor.isServer) {
//   Meteor.startup(function () {
//     if (Players.find().count() === 0) {
//       var names = ["Ada Lovelace",
//                    "Grace Hopper",
//                    "Marie Curie",
//                    "Carl Friedrich Gauss",
//                    "Nikola Tesla",
//                    "Claude Shannon"];
//       for (var i = 0; i < names.length; i++)
//         Players.insert({name: names[i], score: Math.floor(Random.fraction()*10)*5});
//     }
//   });
// }

 // var players = Players.find({});
 //  for (var i=0; i < players.count; i++){
 //    players[i].update({ $set: { score: Math.floor(Random.fraction()*10)*5}});
 //  };
