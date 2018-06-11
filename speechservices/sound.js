var edge = require('edge-js');

exports.Play = function Play(file){
  var play = edge.func(function() {/*
    async (input) => {
        return await Task.Run<object>(async () => {
            var player = new System.Media.SoundPlayer((string)input);
            player.PlaySync();
            return null;
        });
    }
*/});
  play(file, function (err) {
      if (err) throw err;
  });
}
