(function () {
  window.Fifteen = window.Fifteen || {};

  var GameView = Fifteen.GameView = function (frame, ctx) {
    this.frame = frame;
    this.ctx = ctx;
  };

  GameView.prototype.start = function () {
    this.bindClickHandler();
    window.setInterval((function () {
      this.frame.refreshTileCoordinates();
      this.frame.draw(this.ctx);
    }).bind(this), 15);
  };

  GameView.prototype.bindClickHandler = function () {
    var frame = this.frame;
    $(canvas).on('click', function (event) {
      var x = event.pageX - $(this).offset().left;
      var y = event.pageY - $(this).offset().top;
      frame.handleClick([x, y]);
    });
  };

})();
