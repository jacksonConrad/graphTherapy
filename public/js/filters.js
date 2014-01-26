/* Filters ---------------------------------------------------------------------------------------------------------------------------------------------------*/

//This sexy beast lets me use the momentjs library as a filter
angular.module('graphTherapyApp.filters', []).
  filter('fromNow', function() {
    return function(dateString) {
      return moment(dateString).fromNow()
    };
  });