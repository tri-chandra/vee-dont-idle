var UpCommandPlugin = {}
UpCommandPlugin.install = function(vue, options) {
  var payload = {
    status: 'init',
    keepAlive: function() { }
  }

  if (!options) {
    options = {
      restartCallback(payload) {},
      periodicCallback(payload) {},  //TODO: if ping result in time out, dispose UI
      interval: 3000,
      stopTime: 10000,  //TODO: set to 10 mins?
      stoppedCallback(payload) {} //TODO: additional idea, cover the screen, click something to continue session?
    }
  }

  function debounce(callback, timeout, _this) {
      var counter = 0
      var timer

      var interval = {isActive: false, timer: null}
      return function(e) {
          var _that = this

          payload.status = 'running'
          options.restartCallback(payload)
          if (!interval.isActive) {
              interval.timer = setInterval(function() {options.periodicCallback(payload)}, options.interval)
              interval.isActive = true
          }

          if (timer) {
              clearTimeout(timer)
          }
          timer = setTimeout(function() {
              callback.call(_this || _that, interval)
          }, timeout)
      }
  }

  var userAction = debounce(function(e) {
      payload.status = 'stopped'
      options.stoppedCallback(payload)

      clearInterval(e.timer)
      e.timer = null
      e.isActive = false
  }, options.stopTime)
  payload.keepAlive = userAction

  vue.mixin({
    beforeCreate() {
      vue.util.defineReactive(this, '$amitUpCommand', payload)
    },
    mounted() {
      this.$el.addEventListener("mousemove", userAction, false)
      this.$el.addEventListener("click", userAction, false)
      this.$el.addEventListener("scroll", userAction, false)

      userAction()

      this.$data.$amitUpCommand = payload
    }
  })

  // function listenToAjax() {
  //   var origOpen = XMLHttpRequest.prototype.open;
  //   XMLHttpRequest.prototype.open = function() {
  //     console.log('request started!')
  //     // alert('x')
  //     this.addEventListener('load', function() {
  //       if (4 === this.readyState) { userAction() }
  //       // console.log(this.readyState) //will always be 4 (ajax is completed successfully)
  //       // console.log(this.responseText) //whatever the response was
  //     })
  //     origOpen.apply(this, arguments)
  //   }
  // }
  // listenToAjax()

  vue.prototype.$amitUpCommand = payload
}

export default UpCommandPlugin
