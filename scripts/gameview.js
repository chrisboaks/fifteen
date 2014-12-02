(function () {
  window.Fifteen = window.Fifteen || {};

  var GameView = Fifteen.GameView = function (frame, ctx) {
    this.frame = frame;
    this.ctx = ctx;
  };

  GameView.prototype.start = function () {
    window.setInterval((function () {
      this.frame.assignTileCoordinates();
      this.frame.draw(this.ctx);
    }).bind(this), 15);
  };



})();
