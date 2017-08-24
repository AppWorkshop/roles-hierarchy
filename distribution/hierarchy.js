'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var winston = require('winston');
process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
var TreeModel = require('tree-model');
var topiary = require('topiary');
var _ = require('underscore');

var Hierarchy = function () {

  /**
   * create a new instance of Hierarchy
   * @param {Object} paramsObj containing a Hierarchy and a loggingConfig (optional) and a TreeModel config (optional):
   * {
   *   hierarchy: {"name":"teacher", "subordinates": [ {"name":"student"} ]},
   *   treeModelConfig: { "childrenPropertyName": "subordinates" },
   *   loggingConfig: { "level": "debug"}
   * }
   */
  function Hierarchy(paramsObj) {
    _classCallCheck(this, Hierarchy);

    // set up config defaults
    var loggingConfig = paramsObj.loggingConfig || {
      "level": "debug",
      "timestamp": true,
      "colorize": true
    };

    var treeModelConfig = paramsObj.treeModelConfig || { "childrenPropertyName": "subordinates" };

    this.logger = new winston.Logger({
      transports: [new winston.transports.Console(loggingConfig)]
    });

    // actual constructor stuff here.

    // get treeModelConfig from config
    // we need a clone of the treeModelConfig (it doesn't work straight from node-config)
    treeModelConfig = JSON.parse(JSON.stringify(treeModelConfig));
    this.treeModel = new TreeModel(treeModelConfig);
    this.root = this.treeModel.parse(paramsObj.hierarchy);
    this.logger.debug(this.getTopiaryAsString(this.root.model));
  }

  /**
   * re-create the hierarchy with a new object structure.
   * @param {Object} rolesHierarchy 
   */


  _createClass(Hierarchy, [{
    key: 'reparse',
    value: function reparse(hierarchy) {
      this.root = this.treeModel.parse(hierarchy);
    }
  }, {
    key: '_findNode',
    value: function _findNode(nodeName) {
      var startNode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.root;

      return startNode.first({ strategy: 'breadth' }, function (node) {
        return node.model.name === nodeName;
      });
    }
  }, {
    key: '_getOrganizationsForUser',
    value: function _getOrganizationsForUser(myUserObj) {
      var myOrganizations = [];
      if (myUserObj) {
        // figure out which organizations we belong to.
        if (myUserObj.profile && (myUserObj.profile.organization || myUserObj.profile.organizations)) {
          // note the plural
          if (myUserObj.profile.organization) {
            // there can be only one.
            myOrganizations = [myUserObj.profile.organization];
          } else {
            // this guy is in multiple organizations.
            myOrganizations = JSON.parse(JSON.stringify(myUserObj.profile.organizations)); // clone organizations
          }
        } else {
          // default to the global group if there is no org info stored on the profile
          myOrganizations = [_GLOBAL_GROUP];
        }
      }
      return myOrganizations;
    }

    /**
     * Find a role in the hierarchy by name
     * @param {string} nodeName - the name of the role to find
     * @returns {*} - the node in the tree that matches
     */

  }, {
    key: 'findNodeInHierarchy',
    value: function findNodeInHierarchy(nodeName, startNode) {
      var result = this._findNode(nodeName, startNode);
      if (result && result.model) {
        this.logger.debug('findNodeInHierarchy(' + nodeName + ') => returning ' + JSON.stringify(result.model, null, 2));
        return result.model;
      }
      this.logger.debug('findNodeInHierarchy(' + nodeName + ') => returning undefined');
    }

    /**
     * Return the descendent node of the given nodeName if found.
     * @param {string} nodeName - the name of the node underneath which we should search
     * @param {string} descendantNodeName - the name of the descendant node to find
     * @returns {object} - the role of the descendant, or undefined or false if not found.
     */

  }, {
    key: 'findDescendantNodeByName',
    value: function findDescendantNodeByName(nodeName, descendantNodeName, startNode) {
      // get the node for the role name
      var senior = this._findNode(nodeName, startNode);
      if (!senior) {
        return false;
      }
      var junior = this._findNode(descendantNodeName, senior);
      if (junior) {
        this.logger.debug('findDescendantNodeByName(' + nodeName + ',' + descendantNodeName + ') => returning ' + JSON.stringify(junior.model, null, 2));
        return junior.model;
      } else {
        this.logger.debug('findDescendantNodeByName(' + nodeName + ') => returning undefined');
      }
    }

    /**
     * Get the names of subordinate roles as an array
     * @param {string} nodeName - the name of the senior role
     * @returns {Array} - the subordinate role names if any, otherwise undefined.
     */

  }, {
    key: 'getAllDescendantNodesAsArray',
    value: function getAllDescendantNodesAsArray(nodeName, startNode) {
      // find the node for the given node name
      var seniorNode = this._findNode(nodeName, startNode);
      // get all the nodes under this one
      var result = seniorNode.all({ strategy: 'breadth' }, function (node) {
        return node.model.name !== nodeName;
      }).map(function (item) {
        // get the names of each node
        return item.model.name;
      });
      this.logger.debug('getAllDescendantNodesAsArray(' + nodeName + ') => returning ' + JSON.stringify(result, null, 2));
      return result;
    }
  }, {
    key: 'getTopiaryAsString',
    value: function getTopiaryAsString() {
      var hierarchy = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.root;

      return topiary(hierarchy, 'subordinates');
    }
  }]);

  return Hierarchy;
}();

module.exports = Hierarchy;